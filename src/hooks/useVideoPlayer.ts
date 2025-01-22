import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchReelVideo, Video } from "./api/videos/useGetReelVideo";
import { useUpdateWatchHistory } from "./api/users/useUpdateWatchHistory";

export const useVideoPlayer = () => {
   const queryClient = useQueryClient();
   // Store the full response object in previousVideos
   const [previousVideos, setPreviousVideos] = useState<{ data: Video }[]>([]);
   const preloadVideoRef = useRef<HTMLVideoElement | null>(null);

   const {
      data: currentVideo,
      isLoading,
      error,
      refetch: fetchNextVideo,
   } = useQuery({
      queryKey: ["currentVideo"],
      queryFn: fetchReelVideo,
      staleTime: Infinity,
      enabled: false,
   });

   const { data: preloadedVideo, refetch: fetchPreloadedVideo } = useQuery({
      queryKey: ["preloadedVideo"],
      queryFn: fetchReelVideo,
      staleTime: Infinity,
      enabled: false,
   });

   const { mutate: updateWatchHistory } = useUpdateWatchHistory();

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

   const loadNextVideo = async () => {
      if (preloadedVideo) {
         if (currentVideo) {
            // Store the full response object
            setPreviousVideos((prev) => [...prev, currentVideo]);
         }

         queryClient.setQueryData(["currentVideo"], preloadedVideo);
         queryClient.setQueryData(["preloadedVideo"], null);

         updateWatchHistory({
            videoId: preloadedVideo?.data?._id,
         });

         fetchPreloadedVideo();
      } else {
         await fetchNextVideo();
      }
   };

   const loadPreviousVideo = () => {
      if (previousVideos.length === 0) return;

      const lastVideo = previousVideos[previousVideos.length - 1];
      // Set the full response object as the current video
      queryClient.setQueryData(["currentVideo"], lastVideo);
      setPreviousVideos((prev) => prev.slice(0, -1));
   };

   useEffect(() => {
      if (preloadedVideo?.data.videoFile) {
         preloadVideo(preloadedVideo?.data.videoFile).catch(console.error);
      }
   }, [preloadedVideo]);

   useEffect(() => {
      fetchNextVideo();
      fetchPreloadedVideo();
   }, []);

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
