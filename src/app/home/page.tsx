"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import Video from "../components/video";
import { Button } from "@/components/ui/button";
import { BarChart2, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useGetReelVideo } from "@/hooks/api/videos/useGetReelVideo";
import { useUpdateWatchHistory } from "@/hooks/api/users/useUpdateWatchHistory";
import { useWatchHistoryState } from "@/hooks/useWatchHistory";
import { Video as VideoType } from "@/hooks/api/videos/useGetReelVideo";

export default function Home() {
   const { data: reelVideo, isLoading, refetch } = useGetReelVideo();
   const { current, history, pushToHistory, previous, next } = useWatchHistoryState();
   const { mutate: updateWatchHistory } = useUpdateWatchHistory();

   const isLoadingNext = useRef(false);
   const pendingHistoryUpdate = useRef<VideoType[]>([]);

   useEffect(() => {
      const updateTimer = setTimeout(() => {
         if (pendingHistoryUpdate.current.length > 0) {
            const videoIds = pendingHistoryUpdate.current.map((vid) => vid._id);
            updateWatchHistory({ videos: videoIds });
            pendingHistoryUpdate.current = [];
         }
      }, 2000);

      return () => clearTimeout(updateTimer);
   }, [history, updateWatchHistory]);

   useEffect(() => {
      if (reelVideo?.data && !current) {
         pushToHistory(reelVideo.data);
         pendingHistoryUpdate.current.push(reelVideo.data);
      }
   }, [reelVideo, current, pushToHistory]);

   useEffect(() => {
      return () => {
         if (pendingHistoryUpdate.current.length > 0) {
            const videoIds = pendingHistoryUpdate.current.map((vid) => vid._id);
            updateWatchHistory({ videos: videoIds });
         }
      };
   }, [updateWatchHistory]);

   const nextVideo = useCallback(async () => {
      if (isLoadingNext.current) return;

      if (next) {
         pushToHistory(next);
         pendingHistoryUpdate.current.push(next);
      } else {
         isLoadingNext.current = true;
         try {
            const { data } = await refetch();
            if (data?.data) {
               pushToHistory(data.data);
               pendingHistoryUpdate.current.push(data.data);
            }
         } finally {
            isLoadingNext.current = false;
         }
      }
   }, [next, pushToHistory, refetch]);

   const prevVideo = useCallback(() => {
      if (previous) {
         pushToHistory(previous);
      }
   }, [previous, pushToHistory]);

   const handlers = useSwipeable({
      onSwipedUp: nextVideo,
      onSwipedDown: prevVideo,
      trackMouse: true,
   });

   if (isLoading || !current) {
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
               disabled={isLoadingNext.current}
               className="rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 disabled:opacity-30"
            >
               <ChevronDown className="h-6 w-6" />
            </Button>
         </div>
      </div>
   );
}
