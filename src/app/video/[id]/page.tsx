"use client";

import { useParams } from "next/navigation";
import Video from "../../components/video";
import Navbar from "../../components/navbar";
import { useGetVideo } from "@/hooks/api/videos/useGetVideo";

export default function SingleVideo() {
   const params = useParams();
   const videoId = params.id as string;
   const { data: video } = useGetVideo(videoId);

   if (!video) {
      return (
         <div className="text-center">
            <h2 className="text-xl font-semibold mt-10">No such video</h2>
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
