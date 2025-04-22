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
      <>
         <div className="h-5/6 w-full relative">
            <EnhancedVideo src={video.videoFile} />
         </div>

         <div className="flex justify-between px-5">
            <div className=" text-white w-full">
               <div className="flex items-center space-x-2 mb-2">
                  <Image
                     src={video.owner.avatar}
                     alt={video.owner.username}
                     className="w-10 h-10 rounded-full"
                     width={32}
                     height={32}
                  />
                  <Link
                     href={`/profile/${video.owner.username}`}
                     className="text-lg font-bold hover:opacity-70"
                  >
                     @{video.owner.username}
                  </Link>
               </div>
               <p className="text-sm">{video.title}</p>
            </div>

            <div className="flex justify-center items-center w-32">
               <VideoActions videoId={video._id} videoFile={video.videoFile} />
            </div>
         </div>
      </>
   );
}
