import { Video } from "../api/useGetReelVideo";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface FeedVideoCardProps {
   video: Video;
   onProfile?: boolean;
}

export default function FeedVideoCard({ video, onProfile }: FeedVideoCardProps) {
   const { user } = useAuth();
   const router = useRouter();

   return (
      <div
         className="rounded-lg cursor-pointer border duration-200"
         onClick={() => router.push(`/video/${video._id}`)}
         key={video._id}
      >
         <div className="relative" style={{ height: "11rem" }}>
            <Image
               src={video.thumbnail}
               alt={video.title}
               sizes="300"
               fill
               className="object-cover rounded-lg rounded-b-none"
            />
         </div>

         <div className="flex gap-2 p-2">
            <div className="mt-1">
               {!onProfile && (
                  <Image
                     src={video.owner.avatar}
                     width={30}
                     loading="lazy"
                     height={30}
                     className="rounded-full w-6 h-6"
                     alt="Pfp"
                  />
               )}
            </div>

            <div className="flex flex-col gap-1">
               <div className="font-bold text-sm">{video.title}</div>

               {!onProfile && (
                  <div className="text-xs font-bold text-muted-foreground">
                     {video.owner?.username === user?.username
                        ? "You"
                        : `${video.owner?.username}`}
                  </div>
               )}

               <div className="text-xs">{new Date(video.createdAt).toDateString()}</div>
            </div>
         </div>
      </div>
   );
}
