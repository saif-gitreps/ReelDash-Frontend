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
         <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="text-center">
               <h2 className="text-xl font-semibold mb-2">
                  Loading <span className="animate-ping text-bold text-4xl">...</span>
               </h2>
            </div>
         </div>
      );
   }

   if (!currentVideo || !currentVideo.data) {
      return (
         <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="text-center">
               <div className="text-xl font-semibold">No videos available.</div>
            </div>
         </div>
      );
   }

   return (
      <div className="h-screen w-full overflow-hidden relative bg-black">
         <div {...handlers} className="h-full relative">
            <Video video={currentVideo.data} />

            {isTransitioning && (
               <div className="h-screen w-full flex items-center justify-center bg-black text-white">
                  <div className="text-center">
                     <div className="text-xl font-semibold mb-2">
                        Loading{" "}
                        <span className="animate-ping text-bold text-4xl">...</span>
                     </div>
                  </div>
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

         <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex space-x-4 z-10">
            <Button
               variant="default"
               size="icon"
               onClick={handlePreviousVideo}
               disabled={!hasPrevious}
               className="rounded-full opacity-55 hover:bg-opacity-75 disabled:opacity-30 text-4xl"
            >
               <ChevronLeft className="h-40 w-40" />
            </Button>
         </div>

         <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-4 z-10">
            <Button
               variant="default"
               size="icon"
               onClick={handleNextVideo}
               disabled={isTransitioning}
               className="rounded-full opacity-55 hover:bg-opacity-75 disabled:opacity-30"
            >
               <ChevronRight className="h-24 w-24" />
            </Button>
         </div>
      </div>
   );
}
