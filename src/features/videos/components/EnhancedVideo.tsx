"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface EnhancedVideoProps {
   src: string;
}

export default function EnhancedVideo({ src }: EnhancedVideoProps) {
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
      <div className="relative max-w-sm mx-auto h-full flex flex-col justify-center">
         <div
            className="relative w-full"
            style={{ aspectRatio: "9/16", maxHeight: "calc(100vh - 120px)" }}
         >
            <video
               ref={videoRef}
               src={src}
               className="w-full h-full object-cover rounded-lg"
               autoPlay
               muted
               playsInline
               loop
               onClick={handleVideoClick}
            />

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 z-50 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
               <div className="flex items-center space-x-2">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={togglePlayPause}
                     className="text-white hover:bg-white/20 h-7 w-7 p-0"
                  >
                     {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </Button>

                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={toggleMute}
                     className="text-white hover:bg-white/20 h-7 w-7 p-0"
                  >
                     {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </Button>

                  {/* Progress Bar */}
                  <div
                     className="flex-1 h-1 bg-white/30 cursor-pointer rounded-full overflow-hidden"
                     onClick={handleSeek}
                  >
                     <div
                        className="h-full bg-white transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
