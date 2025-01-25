"use client";

import { useParams } from "next/navigation";
import Video from "../../components/Video";
import Navbar from "../../components/Navbar";
import { useGetVideo } from "@/hooks/api/videos/useGetVideo";

export default function SingleVideo() {
   const params = useParams();
   const videoId = params.id as string;
   const { data: video, isLoading } = useGetVideo(videoId);

   if (isLoading) {
      return (
         <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="text-center">
               <div className="text-xl font-semibold mb-2">
                  Loading <span className="animate-ping text-bold text-4xl">...</span>
               </div>
            </div>
         </div>
      );
   }

   if (!video) {
      return (
         <div className="h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="text-center">
               <div className="text-xl font-semibold">No such video</div>
            </div>
         </div>
      );
   }

   return (
      <div className="h-screen w-full overflow-hidden relative">
         <Navbar />
         <Video video={video.data} />
      </div>
   );
}
