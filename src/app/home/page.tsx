"use client";

import { useSwipeable } from "react-swipeable";
import Video from "../components/video";
import { Button } from "@/components/ui/button";
import { BarChart2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useState } from "react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
   const { isAuthenticated } = useAuth();
   const [isTransitioning, setIsTransitioning] = useState(false);

   const {
      currentVideo,
      isLoading: isInitialLoading,
      loadNextVideo,
      loadPreviousVideo,
      hasPrevious,
      isPreloading,
   } = useVideoPlayer();

   const handleNextVideo = async () => {
      if (!isPreloading) {
         setIsTransitioning(true);
      }

      await loadNextVideo();
      setIsTransitioning(false);
   };

   const handlePreviousVideo = () => {
      if (hasPrevious) {
         loadPreviousVideo();
      }
   };

   const handlers = useSwipeable({
      onSwipedUp: handleNextVideo,
      onSwipedDown: handlePreviousVideo,
      trackMouse: false,
   });

   if (!isAuthenticated) {
      return (
         <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="text-center">
               <h2 className="text-xl font-semibold mb-2">
                  Please login to scroll reels.
               </h2>
            </div>
         </div>
      );
   }

   if (isInitialLoading) {
      return (
         <div className="h-screen w-full flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
         </div>
      );
   }

   // Make sure we check for both currentVideo and currentVideo.data
   if (!currentVideo || !currentVideo.data) {
      return (
         <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="text-center">
               <h2 className="text-xl font-semibold mb-2">No videos available</h2>
               <p className="text-gray-400">Try again later</p>
            </div>
         </div>
      );
   }

   return (
      <div className="h-screen w-full overflow-hidden relative bg-black">
         <div {...handlers} className="h-full relative">
            <Video video={currentVideo.data} />

            {isTransitioning && (
               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
               </div>
            )}
         </div>

         <Link href={`/video/${currentVideo.data._id}/stats`}>
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-75 z-10"
            >
               <BarChart2 className="h-6 w-6" />
            </Button>
         </Link>

         <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex space-x-4 z-10">
            <Button
               variant="secondary"
               size="lg"
               onClick={handlePreviousVideo}
               disabled={!hasPrevious}
               className="rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 disabled:opacity-30 text-2xl"
            >
               <ChevronLeft className="h-20 w-20" />
            </Button>
         </div>

         <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex space-x-4 z-10">
            <Button
               variant="secondary"
               size="lg"
               onClick={handleNextVideo}
               disabled={isTransitioning}
               className="rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 disabled:opacity-30"
            >
               <ChevronRight className="h-24 w-24" />
            </Button>
         </div>

         {isPreloading && !isTransitioning && (
            <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
               Next video ready
            </div>
         )}
      </div>
   );
}
