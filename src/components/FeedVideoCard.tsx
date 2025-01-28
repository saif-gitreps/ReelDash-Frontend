import { Video } from "@/hooks/api/videos/useGetReelVideo";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FeedVideoCardProps {
   video: Video;
   onProfile?: boolean;
}

export default function FeedVideoCard({ video, onProfile }: FeedVideoCardProps) {
   const { user } = useAuth();

   return (
      <Link
         href={`/video/${video._id}`}
         key={video._id}
         className="bg-secondary rounded-lg shadow-md overflow-hidden"
      >
         <div className="relative h-48">
            <Image
               src={video.thumbnail}
               alt={video.title}
               layout="fill"
               objectFit="cover"
            />
         </div>

         <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{video.title}</h3>
            {!onProfile && (
               <div className="text-muted-foreground flex gap-2">
                  <Image
                     src={video.owner.avatar}
                     width={30}
                     height={20}
                     className="rounded-full w-8 h-8"
                     alt="Pfp"
                  />
                  <div>
                     {video.owner?.username === user?.username
                        ? "You"
                        : `${video.owner?.username}`}
                  </div>
               </div>
            )}

            <div className="mt-2 text-sm text-muted-foreground">
               {Math.ceil(video.duration)} sec ·{" "}
               {new Date(video.createdAt).toDateString()}
            </div>
         </div>
      </Link>
   );
}
