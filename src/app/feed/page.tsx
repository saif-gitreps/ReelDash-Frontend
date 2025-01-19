"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllVideos } from "@/hooks/api/videos/useGetAllVideos";
import { useAuth } from "@/hooks/useAuth";

const VIDEOS_PER_PAGE = 6;

export default function Feed() {
   const [currentPage, setCurrentPage] = useState(1);
   const { user } = useAuth();

   const { data, isPending, error } = useGetAllVideos({
      page: currentPage,
      limit: VIDEOS_PER_PAGE,
   });

   if (error) {
      return (
         <div className="text-center text-red-500">
            Failed to load videos: {error.message}
         </div>
      );
   }

   const videos = data?.data.videos || [];
   const totalVideos = data?.data.totalVideos || 0;
   const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

   const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         {isPending && videos === undefined ? (
            <div className="text-center">Loading videos...</div>
         ) : (
            <>
               {videos.length === 0 && (
                  <div className="text-center text-muted-foreground">No videos found</div>
               )}

               <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {videos.map((video) => (
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
                           <div className="text-muted-foreground flex gap-2">
                              <Image
                                 src={video.owner.avatar}
                                 width={20}
                                 height={10}
                                 alt="Pfp"
                              />
                              {video.owner?.username === user?.username
                                 ? "You"
                                 : `${video.owner?.username}`}
                           </div>
                           <div className="mt-2 text-sm text-muted-foreground">
                              {Math.ceil(video.duration)} sec ·{" "}
                              {new Date(video.createdAt).toDateString()}
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>

               {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                     <Button
                        onClick={prevPage}
                        disabled={currentPage === 1 || isPending}
                        className="yellow-accent-bg"
                     >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                     </Button>
                     <span>
                        Page {currentPage} of {totalPages}
                     </span>
                     <Button
                        onClick={nextPage}
                        disabled={currentPage === totalPages || isPending}
                        className="yellow-accent-bg"
                     >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                     </Button>
                  </div>
               )}
            </>
         )}
      </div>
   );
}
