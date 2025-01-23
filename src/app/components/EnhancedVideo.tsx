"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface EnhancedVideoProps {
   src: string;
   className?: string;
}

export default function EnhancedVideo({
   src,
   className = "w-full h-full object-contain",
}: EnhancedVideoProps) {
   const videoRef = useRef<HTMLVideoElement>(null);
   const [isPlaying, setIsPlaying] = useState(true);
   const [isMuted, setIsMuted] = useState(true);
   const [progress, setProgress] = useState(0);

   useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const updateProgress = () => {
         const progressPercent = (videoElement.currentTime / videoElement.duration) * 100;
         setProgress(progressPercent);
      };

      videoElement.addEventListener("timeupdate", updateProgress);
      return () => {
         videoElement.removeEventListener("timeupdate", updateProgress);
      };
   }, []);

   const togglePlayPause = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
         video.play();
         setIsPlaying(true);
      } else {
         video.pause();
         setIsPlaying(false);
      }
   };

   const toggleMute = () => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = !video.muted;
      setIsMuted(video.muted);
   };

   const handleVideoClick = (e: React.MouseEvent) => {
      // Prevent triggering if clicking on controls
      if (e.target === videoRef.current) {
         togglePlayPause();
      }
   };

   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      const seekBar = e.currentTarget;
      const video = videoRef.current;
      if (!video || !seekBar) return;

      const rect = seekBar.getBoundingClientRect();
      const seekPosition = (e.clientX - rect.left) / rect.width;
      video.currentTime = seekPosition * video.duration;
   };

   return (
      <div className="relative w-full h-full">
         <video
            ref={videoRef}
            src={src}
            className={className}
            loop
            autoPlay
            muted
            playsInline
            onClick={handleVideoClick}
         />

         <div className="absolute z-50 bottom-0 max-w-lg ml-20 lg:mx-auto left-10 right-0 bg-black opacity-35 flex items-center p-2">
            <div className="flex items-center space-x-1">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/20"
               >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
               </Button>

               <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
               >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
               </Button>
            </div>

            <div
               className="flex-grow mx-1 h-1 bg-white/30 cursor-pointer"
               onClick={handleSeek}
            >
               <div className="h-full bg-white" style={{ width: `${progress}%` }} />
            </div>
         </div>
      </div>
   );
}
