"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useVideoPlayer } from "../hooks/useVideoPlayer";

interface EnhancedVideoProps {
   src: string;
}

const ensureHttpsUrl = (url: string): string => {
   if (!url) return url;

   if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
   }

   if (url.includes("cloudinary.com") && !url.startsWith("https://")) {
      return `https://${url.replace(/^https?:\/\//, "")}`;
   }

   return url;
};

export default function EnhancedVideo({ src }: EnhancedVideoProps) {
   const videoRef = useRef<HTMLVideoElement>(null);
   const secureUrl = ensureHttpsUrl(src);

   const {
      isPlaying,
      isMuted,
      progress,
      isLoading,
      hasError,
      canPlay,
      togglePlayPause,
      toggleMute,
      seek,
   } = useVideoPlayer(videoRef, secureUrl);

   const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      seek((e.clientX - rect.left) / rect.width);
   };

   if (hasError) {
      return (
         <div className="relative max-w-sm mx-auto h-full flex flex-col justify-center">
            <div
               className="relative w-full bg-gray-800 rounded-lg flex items-center justify-center"
               style={{ aspectRatio: "9/16", maxHeight: "calc(100vh - 105p)" }}
            >
               <div className="text-white text-center p-4">
                  <div className="text-sm mb-2">Failed to load video</div>
                  <Button
                     onClick={() => window.location.reload()}
                     variant="outline"
                     size="sm"
                     className="text-white border-white hover:bg-white hover:text-black"
                  >
                     Retry
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div
         className="h-full min-w-full w-full relative"
         style={{ aspectRatio: "9/16", maxHeight: "calc(100vh - 105px)" }}
      >
         <video
            ref={videoRef}
            src={secureUrl}
            className="h-full w-full object-contain cursor-pointer"
            muted
            playsInline
            loop
            onClick={togglePlayPause}
         />

         {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
               <Loader2 className="size-10 animate-spin stroke-white" />
            </div>
         )}

         <div className="absolute bottom-0 right-0 p-2 rounded-b-lg">
            <div className="flex items-center justify-center space-x-2">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  disabled={!canPlay}
                  className="text-white hover:bg-white/20 h-7 w-7 p-0 disabled:opacity-50"
               >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
               </Button>

               <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  disabled={!canPlay}
                  className="text-white"
               >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
               </Button>

               <div
                  className={`flex-1 h-1 bg-white/30 rounded-full overflow-hidden ${
                     canPlay ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={canPlay ? handleSeekClick : undefined}
               >
                  <div
                     className="h-full bg-white transition-all duration-300 ease-out"
                     style={{ width: `${progress}%` }}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
