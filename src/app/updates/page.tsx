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
import { useAuth } from "@/hooks/useAuth";
import AuthLayer from "../components/AuthLayer";
import { useQueryClient } from "@tanstack/react-query";

const UPDATES_PER_PAGE = 5;

export default function Updates() {
   const [isMounted, setIsMounted] = useState(false);
   const [showOwnUpates, setShowOwnUpdates] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const { user } = useAuth();

   const { data, isFetching } = useGetSubbedChannelsPosts({
      page: currentPage,
      limit: UPDATES_PER_PAGE,
   });
   const { mutate: deleteUpdate, isPending: isDeletePending } = useDeletePost();

   useEffect(() => {
      setIsMounted(true);
   }, []);

   const posts = data?.data.posts || [];
   const totalPosts = data?.data.totalPosts || 0;
   const totalPages = Math.ceil(totalPosts / UPDATES_PER_PAGE);

   const filteredUpdates = showOwnUpates
      ? posts.filter((post) => post.owner === user?._id)
      : posts;

   const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

   const queryClient = useQueryClient();

   const handleDelete = async (id: string) => {
      deleteUpdate(id, {
         onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ["subbedChannelsPosts"] });
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
      <AuthLayer isProtected>
         <div
            className="container mx-auto p-4 bg-background text-foreground"
            data-gramm="false"
         >
            <div className="flex justify-end items-center mb-4">
               <div className="space-x-2 flex">
                  <Button
                     onClick={() => setShowOwnUpdates(!showOwnUpates)}
                     className="yellow-accent-bg"
                  >
                     <Filter className="w-4 h-4 md:mr-2" />
                     {showOwnUpates ? "Show All" : "My Posts"}
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
               {filteredUpdates.length === 0 ? (
                  <div className="text-center text-muted-foreground">No updates</div>
               ) : (
                  filteredUpdates.map((update) => (
                     <div
                        key={update._id}
                        className="bg-secondary p-3 rounded-lg flex justify-between"
                     >
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

                                 <div>
                                    {update.ownerDetails.username == user?.username
                                       ? "You"
                                       : update.ownerDetails.username}
                                 </div>
                              </div>
                              <div className="text-xs text-gray-300">
                                 {formatDate(update.createdAt)}
                              </div>
                           </div>
                           <div>{update.content}</div>
                        </div>
                        <div>
                           {update.owner === user?._id && (
                              <Button
                                 variant="ghost"
                                 onClick={() => handleDelete(update._id)}
                                 className="text-destructive hover:text-destructive"
                                 disabled={isDeletePending}
                              >
                                 {isDeletePending ? (
                                    <Loader2 className="animate-spin" size={32} />
                                 ) : (
                                    <Trash2 size={32} />
                                 )}
                              </Button>
                           )}
                        </div>
                     </div>
                  ))
               )}
            </div>

            {totalPages > 1 && (
               <div className="flex justify-between items-center mt-4">
                  <Button
                     onClick={prevPage}
                     disabled={currentPage === 1 || isFetching}
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
                     disabled={currentPage === totalPages || isFetching}
                     className="yellow-accent-bg"
                  >
                     Next
                     <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            )}
         </div>
      </AuthLayer>
   );
}
