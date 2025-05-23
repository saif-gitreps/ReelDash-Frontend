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
      <div className="h-full w-full flex flex-col">
         {/* Video Container - Takes most of the screen */}
         <div className="flex-1 relative flex items-center justify-center bg-black">
            <EnhancedVideo src={video.videoFile} />
         </div>

         {/* Info Section - Fixed height at bottom */}
         <div className="h-24 flex items-center justify-between px-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-10 py-6">
            <div className="text-white flex-1 mr-4">
               <div className="flex items-center space-x-2 mb-1">
                  <Image
                     src={video.owner.avatar}
                     alt={video.owner.username}
                     className="w-8 h-8 rounded-full"
                     width={32}
                     height={32}
                  />
                  <Link
                     href={`/profile/${video.owner.username}`}
                     className="text-sm font-bold hover:opacity-70"
                  >
                     @{video.owner.username}
                  </Link>
               </div>
               <p className="text-xs line-clamp-2">{video.title}</p>
            </div>

            <div className="flex items-center z-large">
               <VideoActions videoId={video._id} videoFile={video.videoFile} />
            </div>
         </div>
      </div>
   );
}
