"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";

interface EnhancedVideoProps {
   src: string;
}

// Utility function to ensure HTTPS URLs from Cloudinary
const ensureHttpsUrl = (url: string): string => {
   if (!url) return url;

   // Convert HTTP to HTTPS
   if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
   }

   // For Cloudinary URLs, ensure they use HTTPS
   if (url.includes("cloudinary.com") && !url.startsWith("https://")) {
      return `https://${url.replace(/^https?:\/\//, "")}`;
   }

   return url;
};

export default function EnhancedVideo({ src }: EnhancedVideoProps) {
   const videoRef = useRef<HTMLVideoElement>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [isMuted, setIsMuted] = useState(true);
   const [progress, setProgress] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [hasError, setHasError] = useState(false);
   const [canPlay, setCanPlay] = useState(false);

   // Ensure HTTPS URL
   const secureVideoUrl = ensureHttpsUrl(src);

   useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const handleLoadStart = () => {
         setIsLoading(true);
         setHasError(false);
      };

      const handleCanPlay = () => {
         setCanPlay(true);
         setIsLoading(false);
      };

      const handleCanPlayThrough = () => {
         setIsLoading(false);
         // Auto-play once the video is ready
         if (videoElement && !isPlaying) {
            videoElement
               .play()
               .then(() => {
                  setIsPlaying(true);
               })
               .catch((error) => {
                  console.log("Auto-play failed:", error);
                  setIsPlaying(false);
               });
         }
      };

      const handleWaiting = () => {
         setIsLoading(true);
      };

      const handlePlaying = () => {
         setIsLoading(false);
         setIsPlaying(true);
      };

      const handlePause = () => {
         setIsPlaying(false);
      };

      const handleError = () => {
         setIsLoading(false);
         setHasError(true);
         console.error("Video loading error");
      };

      const updateProgress = () => {
         if (videoElement.duration) {
            const progressPercent =
               (videoElement.currentTime / videoElement.duration) * 100;
            setProgress(progressPercent);
         }
      };

      // Add event listeners
      videoElement.addEventListener("loadstart", handleLoadStart);
      videoElement.addEventListener("canplay", handleCanPlay);
      videoElement.addEventListener("canplaythrough", handleCanPlayThrough);
      videoElement.addEventListener("waiting", handleWaiting);
      videoElement.addEventListener("playing", handlePlaying);
      videoElement.addEventListener("pause", handlePause);
      videoElement.addEventListener("error", handleError);
      videoElement.addEventListener("timeupdate", updateProgress);

      return () => {
         videoElement.removeEventListener("loadstart", handleLoadStart);
         videoElement.removeEventListener("canplay", handleCanPlay);
         videoElement.removeEventListener("canplaythrough", handleCanPlayThrough);
         videoElement.removeEventListener("waiting", handleWaiting);
         videoElement.removeEventListener("playing", handlePlaying);
         videoElement.removeEventListener("pause", handlePause);
         videoElement.removeEventListener("error", handleError);
         videoElement.removeEventListener("timeupdate", updateProgress);
      };
   }, [isPlaying]);

   // Reset states when video source changes
   useEffect(() => {
      setIsLoading(true);
      setHasError(false);
      setCanPlay(false);
      setIsPlaying(false);
      setProgress(0);
   }, [secureVideoUrl]);

   const togglePlayPause = () => {
      const video = videoRef.current;
      if (!video || !canPlay) return;

      if (video.paused) {
         video
            .play()
            .then(() => {
               setIsPlaying(true);
            })
            .catch((error) => {
               console.log("Play failed:", error);
            });
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
      if (e.target === videoRef.current && canPlay) {
         togglePlayPause();
      }
   };

   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      const seekBar = e.currentTarget;
      const video = videoRef.current;
      if (!video || !seekBar || !canPlay) return;
      const rect = seekBar.getBoundingClientRect();
      const seekPosition = (e.clientX - rect.left) / rect.width;
      video.currentTime = seekPosition * video.duration;
   };

   if (hasError) {
      return (
         <div className="relative max-w-sm mx-auto h-full flex flex-col justify-center">
            <div
               className="relative w-full bg-gray-800 rounded-lg flex items-center justify-center"
               style={{ aspectRatio: "9/16", maxHeight: "calc(100vh - 120px)" }}
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
      <div className="relative max-w-sm mx-auto h-full flex flex-col justify-center">
         <div
            className="relative w-full"
            style={{ aspectRatio: "9/16", maxHeight: "calc(100vh - 120px)" }}
         >
            <video
               ref={videoRef}
               src={secureVideoUrl}
               className="w-full h-full object-cover rounded-lg"
               muted
               playsInline
               loop
               preload="metadata"
               onClick={handleVideoClick}
            />

            {/* Loading Overlay */}
            {isLoading && (
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                     <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                     <div className="text-sm">Loading video...</div>
                  </div>
               </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
               <div className="flex items-center space-x-2">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={togglePlayPause}
                     disabled={!canPlay}
                     className="text-white hover:bg-white/20 h-7 w-7 p-0 disabled:opacity-50"
                  >
                     {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </Button>

                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={toggleMute}
                     disabled={!canPlay}
                     className="text-white hover:bg-white/20 h-7 w-7 p-0 disabled:opacity-50"
                  >
                     {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </Button>

                  {/* Progress Bar */}
                  <div
                     className={`flex-1 h-1 bg-white/30 rounded-full overflow-hidden ${
                        canPlay ? "cursor-pointer" : "cursor-not-allowed"
                     }`}
                     onClick={canPlay ? handleSeek : undefined}
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
