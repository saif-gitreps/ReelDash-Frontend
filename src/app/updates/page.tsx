"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useGetSubbedChannelsPosts } from "@/hooks/api/updates/useGetSubbedChannelsPosts";
import { useDeletePost } from "@/hooks/api/updates/useDeleteUpdate";
import Image from "next/image";
import formatDate from "@/lib/format-date";

const UPDATES_PER_PAGE = 6;

export default function Updates() {
   const [isMounted, setIsMounted] = useState(false);
   const [showOwnUpates, setShowOwnUpdates] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);

   const { data, isFetching } = useGetSubbedChannelsPosts({
      page: currentPage,
      limit: UPDATES_PER_PAGE,
   });
   const { mutate: deleteUpdate, isPending: isDeletePending } = useDeletePost();

   useEffect(() => {
      setIsMounted(true);
   }, []);

   const updates = data?.data || [];
   const totalPages = Math.ceil((updates.length || 0) / UPDATES_PER_PAGE); // Use totalCount instead of length

   // const filteredUpdates = showOwnUpates
   //    ? updates.filter((post) => post.owner === "your-user-id")
   //    : updates;

   const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

   const handleDelete = async (id: string) => {
      deleteUpdate(id, {
         onSuccess: (response) => {
            toast.success(response.message);
         },
         onError: (error) => {
            toast.error(`Deleting update failed. ${error.message}`);
         },
      });
   };

   if (isFetching || !isMounted) {
      return (
         <div className="container mx-auto p-4 bg-background text-foreground">
            <div className="animate-pulse space-y-4">
               <div className="h-8 bg-secondary rounded w-1/3"></div>
               <div className="h-32 bg-secondary rounded"></div>
               <div className="h-32 bg-secondary rounded"></div>
               <div className="h-32 bg-secondary rounded"></div>
               <div className="h-32 bg-secondary rounded"></div>
               <div className="h-32 bg-secondary rounded"></div>
               <div className="h-32 bg-secondary rounded"></div>
            </div>
         </div>
      );
   }

   return (
      <div
         className="container mx-auto p-4 bg-background text-foreground"
         data-gramm="false"
      >
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold hidden sm:block">
               Updates from subscribed channels
            </h1>
            <div className="space-x-2 flex">
               <Button
                  onClick={() => setShowOwnUpdates(!showOwnUpates)}
                  className="yellow-accent-bg"
               >
                  <Filter className="w-4 h-4 md:mr-2" />
                  {showOwnUpates ? "Show All" : "Show My Posts"}
               </Button>
               <Link href="/updates/new">
                  <Button className="yellow-accent-bg">
                     <Plus className="w-4 h-4 md:mr-2" />
                     New Post
                  </Button>
               </Link>
            </div>
         </div>

         <div className="space-y-2">
            {updates.length === 0 ? (
               <div className="text-center text-muted-foreground">No updates</div>
            ) : (
               updates.map((update) => (
                  <div key={update._id} className="bg-secondary p-3 rounded-lg ">
                     <div>
                        <div className="mb-4">
                           <div className="font-semibold flex gap-2 mb-2 items-center">
                              {/* TODO: Make this a link to profile*/}
                              <Image
                                 src={update.ownerDetails.avatar}
                                 width={20}
                                 height={10}
                                 alt={update.ownerDetails.username}
                                 className="rounded-full"
                              />

                              <div>{update.ownerDetails.username}</div>
                           </div>
                           <div className="text-xs text-gray-300">
                              {formatDate(update.createdAt)}
                           </div>
                        </div>
                        <div>{update.content}</div>
                     </div>
                     {update.owner === "your-user-id" && (
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => handleDelete(update._id)}
                           className="text-destructive hover:text-destructive"
                        >
                           {isDeletePending ? (
                              <Loader2 className="animate-spin" />
                           ) : (
                              <Trash2 className="w-4 h-4" />
                           )}
                        </Button>
                     )}
                  </div>
               ))
            )}
         </div>

         <div className="flex justify-between items-center mt-4">
            <Button
               onClick={prevPage}
               disabled={currentPage === 1}
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
               disabled={currentPage === totalPages}
               className="yellow-accent-bg"
            >
               Next
               <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
         </div>
      </div>
   );
}
