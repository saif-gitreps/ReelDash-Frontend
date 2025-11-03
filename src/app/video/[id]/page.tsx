"use client";

import { useParams } from "next/navigation";
import { useGetVideo } from "@/features/videos/api/useGetVideo";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useUpdateWatchHistory } from "@/features/user/api/useUpdateWatchHistory";
import Navbar from "@/components/Navbar";
import VideoSection from "@/features/videos/components/VideoSection";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";

export default function SingleVideo() {
   const params = useParams();
   const videoId = params.id as string;
   const { data: video, isLoading } = useGetVideo(videoId);
   const { isAuthenticated } = useAuth();
   const { mutate: updateWatchHistory } = useUpdateWatchHistory();

   useEffect(() => {
      if (isAuthenticated && video) {
         updateWatchHistory({
            videoId,
         });
      }
   }, [videoId, isAuthenticated, video, updateWatchHistory]);

   if (isLoading) {
      return <Loader />;
   }

   if (!video) {
      return <ErrorMessage>No such video available</ErrorMessage>;
   }

   return (
      <div className="h-screen w-full flex justify-between flex-col relative">
         <Navbar />

         <VideoSection video={video.data} />
      </div>
   );
}
