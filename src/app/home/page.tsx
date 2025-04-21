"use client";

// import { useSwipeable } from "react-swipeable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useAuth } from "@/hooks/useAuth";
import Loading from "../../components/Loading";
import { useUpdateWatchHistory } from "../../features/user/api/useUpdateWatchHistory";
import VideoSection from "@/features/videos/components/VideoSection";

export default function Home() {
   const { isAuthenticated } = useAuth();
   const [isTransitioning, setIsTransitioning] = useState(false);
   const { mutate: updateWatchHistory } = useUpdateWatchHistory();

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

   // const handlers = useSwipeable({
   //    onSwipedUp: handleNextVideo,
   //    onSwipedDown: handlePreviousVideo,
   //    trackMouse: false,
   // });

   useEffect(() => {
      if (isAuthenticated && currentVideo && currentVideo.data) {
         updateWatchHistory({
            videoId: currentVideo.data._id,
         });
      }
   }, [isAuthenticated, updateWatchHistory, currentVideo]);

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
      return <Loading />;
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
      <div className="w-full h-screen overflow-hidden bg-black flex justify-between flex-col relative">
         <VideoSection video={currentVideo.data} />

         <div className="absolute top-1/3 flex px-5 justify-between w-full">
            <div className="flex space-x-4 z-10">
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
            <div className="flex space-x-4 z-10">
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
      </div>
   );
}
