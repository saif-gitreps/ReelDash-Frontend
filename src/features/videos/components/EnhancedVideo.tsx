"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Loader from "@/components/Loader";
import { useVideoPlayer } from "../hooks/useVideoPlayer";

interface EnhancedVideoProps {
   src: string;
}

const ensureHttpsUrl = (url: string): string => {
   if (!url) return url;
   return url.replace(/^http:\/\//, "https://");
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
         <div className="flex items-center justify-center bg-gray-900 rounded-lg aspect-[9/16] max-h-[80vh]">
            <div className="text-center p-4">
               <p className="text-white text-sm mb-4">Video failed to load</p>
               <Button onClick={() => window.location.reload()} variant="outline">
                  Retry
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="relative w-full aspect-[9/16] max-h-[80vh] overflow-hidden bg-black rounded-lg">
         <video
            ref={videoRef}
            src={secureUrl}
            className="h-full w-full object-contain cursor-pointer"
            muted
            playsInline
            loop
            onClick={togglePlayPause}
         />

         {isLoading && <Loader />}

         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  disabled={!canPlay}
                  className="text-white"
               >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
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
                  className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden"
                  onClick={handleSeekClick}
               >
                  <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
               </div>
            </div>
         </div>
      </div>
   );
}
