import { Video } from "../api/useGetReelVideo";
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
         className="bg-secondary rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
      >
         <div>
            <div className="relative" style={{ height: "12rem" }}>
               <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
               />
            </div>
            <h3 className="font-bold text-lg px-4 py-2">{video.title}</h3>
         </div>

         <div className=" px-4 py-2">
            {!onProfile && (
               <div className="text-muted-foreground flex gap-2 items-center">
                  <Image
                     src={video.owner.avatar}
                     width={30}
                     loading="lazy"
                     height={30}
                     className="rounded-full w-5 h-5"
                     alt="Pfp"
                  />
                  <div
                     className={`text-center ${
                        video.owner?.username === user?.username
                           ? "text-gray-700 font-light"
                           : ""
                     }`}
                  >
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
