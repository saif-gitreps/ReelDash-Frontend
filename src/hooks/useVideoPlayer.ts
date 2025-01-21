import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReelVideo, Video } from "./api/videos/useGetReelVideo";
import { useUpdateWatchHistory } from "./api/users/useUpdateWatchHistory";

export const useVideoPlayer = () => {
   const queryClient = useQueryClient();
   const [previousVideos, setPreviousVideos] = useState<Video[]>([]);
   const preloadVideoRef = useRef<HTMLVideoElement | null>(null);

   // Current video query
   const {
      data: currentVideo,
      isLoading,
      error,
      refetch: fetchNextVideo,
   } = useQuery({
      queryKey: ["currentVideo"],
      queryFn: fetchReelVideo,
      staleTime: Infinity, // Don't refetch automatically
      enabled: false, // Don't fetch on mount
   });

   // Preloaded video query
   const { data: preloadedVideo, refetch: fetchPreloadedVideo } = useQuery({
      queryKey: ["preloadedVideo"],
      queryFn: fetchReelVideo,
      staleTime: Infinity,
      enabled: false,
   });

   // Watch history mutation
   const { mutate: updateWatchHistory } = useUpdateWatchHistory();

   // Preload video function
   const preloadVideo = async (videoUrl: string) => {
      if (!preloadVideoRef.current) {
         preloadVideoRef.current = document.createElement("video");
      }

      preloadVideoRef.current.preload = "auto";
      preloadVideoRef.current.src = videoUrl;

      return new Promise((resolve, reject) => {
         if (preloadVideoRef.current) {
            preloadVideoRef.current.oncanplaythrough = () => resolve(true);
            preloadVideoRef.current.onerror = () => reject();
         }
      });
   };

   // Load next video and preload another
   const loadNextVideo = async () => {
      // If we have a preloaded video, use it
      if (preloadedVideo) {
         if (currentVideo) {
            setPreviousVideos((prev) => [...prev, currentVideo]);
         }

         // Set preloaded video as current
         queryClient.setQueryData(["currentVideo"], preloadedVideo);
         // Clear preloaded video
         queryClient.setQueryData(["preloadedVideo"], null);

         // Update watch history
         updateWatchHistory({preloadedVideo.data._id});

         // Fetch and preload next video
         fetchPreloadedVideo();
      } else {
         // Fallback if no preloaded video
         await fetchNextVideo();
      }
   };

   // Preload next video whenever preloadedVideo changes
   useEffect(() => {
      if (preloadedVideo?.url) {
         preloadVideo(preloadedVideo.url).catch(console.error);
      }
   }, [preloadedVideo]);

   // Load initial videos on mount
   useEffect(() => {
      fetchNextVideo();
      fetchPreloadedVideo();
   }, []);

   const loadPreviousVideo = () => {
      if (previousVideos.length === 0) return;

      const lastVideo = previousVideos[previousVideos.length - 1];
      queryClient.setQueryData(["currentVideo"], lastVideo);
      setPreviousVideos((prev) => prev.slice(0, -1));
   };

   return {
      currentVideo,
      isLoading,
      error,
      loadNextVideo,
      loadPreviousVideo,
      hasPrevious: previousVideos.length > 0,
      isPreloading: !!preloadedVideo,
   };
};
