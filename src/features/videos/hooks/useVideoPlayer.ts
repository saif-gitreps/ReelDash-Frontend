import { useState, useEffect, RefObject } from "react";
import toast from "react-hot-toast";

export const useVideoPlayer = (
   videoRef: RefObject<HTMLVideoElement | null>,
   src: string
) => {
   const [isPlaying, setIsPlaying] = useState(false);
   const [isMuted, setIsMuted] = useState(true);
   const [progress, setProgress] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [hasError, setHasError] = useState(false);
   const [canPlay, setCanPlay] = useState(false);

   useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      setIsLoading(true);
      setHasError(false);
      setCanPlay(false);
      setProgress(0);

      const handleCanPlay = () => {
         setCanPlay(true);
         setIsLoading(false);
      };

      const handleCanPlayThrough = () => {
         setIsLoading(false);

         if (video.paused) {
            video.play().catch((error) => {
               toast.error("Video play error: ", error);
            });
         }
      };

      const updateProgress = () => {
         if (video.duration) {
            setProgress((video.currentTime / video.duration) * 100);
         }
      };

      const handlePlayState = () => setIsPlaying(true);
      const handlePauseState = () => setIsPlaying(false);
      const handleError = () => {
         setIsLoading(false);
         setHasError(true);
      };

      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("canplaythrough", handleCanPlayThrough);
      video.addEventListener("playing", handlePlayState);
      video.addEventListener("pause", handlePauseState);
      video.addEventListener("error", handleError);
      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("waiting", () => setIsLoading(true));

      return () => {
         video.removeEventListener("canplay", handleCanPlay);
         video.removeEventListener("canplaythrough", handleCanPlayThrough);
         video.removeEventListener("playing", handlePlayState);
         video.removeEventListener("pause", handlePauseState);
         video.removeEventListener("error", handleError);
         video.removeEventListener("timeupdate", updateProgress);
      };
   }, [src, videoRef]);

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
               toast.error("Video play error: ", error);
            });
      } else {
         video.pause();
         setIsPlaying(false);
      }
   };

   const toggleMute = () => {
      if (!videoRef.current) return;
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
   };

   const seek = (percent: number) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = percent * videoRef.current.duration;
   };

   return {
      isPlaying,
      isMuted,
      progress,
      isLoading,
      hasError,
      canPlay,
      togglePlayPause,
      toggleMute,
      seek,
   };
};
