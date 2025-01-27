"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetSubscribedChannelsVideos } from "@/hooks/api/videos/useGetSubscribedChannelVideos";
import AuthLayer from "../components/AuthLayer";
import FeedVideoCard from "../components/FeedVideoCard";

const VIDEOS_PER_PAGE = 6;

export default function Feed() {
   const [currentPage, setCurrentPage] = useState(1);

   const { data, isPending, error } = useGetSubscribedChannelsVideos({
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
      <AuthLayer isProtected>
         <div className="container mx-auto p-4 bg-background text-foreground">
            {isPending && videos === undefined ? (
               <div className="text-center">Loading videos...</div>
            ) : (
               <>
                  {videos.length === 0 && (
                     <div className="text-center text-muted-foreground">
                        You have not subscribed to any channels yet.
                     </div>
                  )}

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
                     {videos.map((video) => (
                        <FeedVideoCard video={video} key={video._id} />
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
      </AuthLayer>
   );
}
