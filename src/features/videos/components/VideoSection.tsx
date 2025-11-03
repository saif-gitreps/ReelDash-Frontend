import React from "react";
import EnhancedVideo from "./EnhancedVideo";
import Image from "next/image";
import Link from "next/link";
import VideoActions from "./VideoActions";
import { Video } from "../api/useGetVideo";

interface VideoSectionProps {
   video: Video;
}

export default function VideoSection({ video }: VideoSectionProps) {
   return (
      <div className="h-full flex flex-col justify-between items-center">
         <div className="text-white w-full px-4 pt-4 mt-4">
            <div className="flex items-center space-x-2 mx-2">
               <Image
                  src={video.owner.avatar}
                  alt={video.owner.username}
                  className="w-5 h-5 rounded-full"
                  width={32}
                  height={32}
               />
               <Link
                  href={`/profile/${video.owner.username}`}
                  className="text-xs font-bold hover:opacity-70"
               >
                  @{video.owner.username}
               </Link>
            </div>
            <div className="text-xs">{video.title}</div>
         </div>

         <div className="flex flex-col justify-between">
            <div className="flex items-center justify-center bg-black">
               <EnhancedVideo src={video.videoFile} />
            </div>
         </div>
         <div className="mb-4">
            <VideoActions videoId={video._id} videoFile={video.videoFile} />
         </div>
      </div>
   );
}
