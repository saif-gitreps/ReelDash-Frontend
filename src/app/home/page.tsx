"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Video from "../components/video";
import { Button } from "@/components/ui/button";
import { BarChart2, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useUpdateWatchHistory } from "@/hooks/api/users/useUpdateWatchHistory";
import { useWatchHistoryState } from "@/hooks/useWatchHistory";
import { fetchReelVideo, Video as VideoType } from "@/hooks/api/videos/useGetReelVideo";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
   const queryClient = useQueryClient();
   const [previousVideos, setPreviousVideos] = useState<Video[]>([]);
   const preloadVideoRef = useRef<HTMLVideoElement | null>(null);

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
         watchHistoryMutation.mutate(preloadedVideo.id);

         // Fetch and preload next video
         fetchPreloadedVideo();
      } else {
         // Fallback if no preloaded video
         await fetchNextVideo();
      }
   };

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

   if (isLoading) {
      return (
         <div className="h-screen w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
         </div>
      );
   }

   return (
      <div className="h-screen w-full overflow-hidden relative bg-black">
         <div {...handlers} className="h-full">
            <Video video={current} />
         </div>
         <Link href={`/video/${current._id}/stats`}>
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-75 z-10"
            >
               <BarChart2 className="h-6 w-6" />
            </Button>
         </Link>
         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
            <Button
               variant="secondary"
               size="icon"
               onClick={prevVideo}
               disabled={!previous}
               className="rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 disabled:opacity-30"
            >
               <ChevronUp className="h-6 w-6" />
            </Button>
            <Button
               variant="secondary"
               size="icon"
               onClick={nextVideo}
               disabled={}
               className="rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 disabled:opacity-30"
            >
               <ChevronDown className="h-6 w-6" />
            </Button>
         </div>
      </div>
   );
}
