"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllVideos } from "../../features/videos/api/useGetAllVideos";
import FeedVideoCard from "../../features/videos/components/FeedVideoCard";
import Loading from "../../components/Loading";

const VIDEOS_PER_PAGE = 9;

export default function Feed() {
   const [currentPage, setCurrentPage] = useState(1);

   const { data, isLoading, error } = useGetAllVideos({
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

   if (isLoading && data === undefined) {
      return <Loading />;
   }

   return (
      <div className="mx-auto p-4 bg-background text-foreground">
         {videos.length === 0 && (
            <div className="text-center text-muted-foreground">No videos found</div>
         )}

         <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
            {videos.map((video) => (
               <FeedVideoCard video={video} key={video._id} />
            ))}
         </div>

         {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-xs">
               <Button
                  onClick={prevPage}
                  disabled={currentPage === 1 || isLoading}
                  size={"sm"}
               >
                  <ChevronLeft className="w-2 h-2 mr-2" />
                  Previous
               </Button>
               <span>
                  Page {currentPage} of {totalPages}
               </span>
               <Button
                  onClick={nextPage}
                  disabled={currentPage === totalPages || isLoading}
                  size={"sm"}
               >
                  Next
                  <ChevronRight className="w-2 h-2 ml-2" />
               </Button>
            </div>
         )}
      </div>
   );
}
