"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateWatchHistory } from "../../features/user/api/useUpdateWatchHistory";
import VideoSection from "@/features/videos/components/VideoSection";
import GuestLoginButton from "@/features/guest-login/components/GuestLoginButton";
import Loader from "../../components/Loader";
import ErrorMessage from "@/components/ErrorMessage";

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
               <GuestLoginButton />
            </div>
         </div>
      );
   }

   if (isInitialLoading) {
      return <Loader />;
   }

   if (!currentVideo || !currentVideo.data) {
      return <ErrorMessage>No videos currently</ErrorMessage>;
   }

   return (
      <div className="w-full h-screen bg-black relative overflow-hidden">
         <VideoSection video={currentVideo.data} />

         {/* Navigation Controls */}
         <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            <Button
               variant="default"
               size="icon"
               onClick={handlePreviousVideo}
               disabled={!hasPrevious}
               className="rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-30 pointer-events-auto w-12 h-12"
            >
               <ChevronLeft className="h-6 w-6 text-white" />
            </Button>

            <Button
               variant="default"
               size="icon"
               onClick={handleNextVideo}
               disabled={isTransitioning}
               className="rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-30 pointer-events-auto w-12 h-12"
            >
               <ChevronRight className="h-6 w-6 text-white" />
            </Button>
         </div>
      </div>
   );
}
