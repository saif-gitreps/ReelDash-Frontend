"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetSubscribedChannelsVideos } from "@/features/videos/hooks/useGetSubscribedChannelVideos";
import AuthLayer from "../../components/AuthLayer";
import FeedVideoCard from "../../features/videos/components/FeedVideoCard";
import Loading from "../../components/Loading";
import { useGetSubscribedChannels } from "@/hooks/api/subscription/useGetSubbedChannels";
import Link from "next/link";
import Image from "next/image";

const VIDEOS_PER_PAGE = 6;

export default function Feed() {
   const [currentPage, setCurrentPage] = useState(1);

   const { data, isLoading, error } = useGetSubscribedChannelsVideos({
      page: currentPage,
      limit: VIDEOS_PER_PAGE,
   });
   const { data: subscribedChannels, isLoading: isSubscribedChannelsLoading } =
      useGetSubscribedChannels();

   if (error) {
      return (
         <div className="text-center text-red-500">
            Failed to load videos: {error.message}
         </div>
      );
   }

   const channels = subscribedChannels?.data || [];
   const videos = data?.data.videos || [];
   const totalVideos = data?.data.totalVideos || 0;
   const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

   const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

   if (isLoading && isSubscribedChannelsLoading && data === undefined) {
      return <Loading />;
   }

   if (channels.length === 0) {
      return (
         <div className="text-center text-muted-foreground mt-5">
            You have not subscribed to any channels yet.
         </div>
      );
   }

   return (
      <AuthLayer isProtected>
         <div className="container mx-auto p-4 bg-background text-foreground">
            <div className="flex py-3 mb-2">
               <h1 className="text-muted-foreground font-bold sm:flex items-center hidden">
                  Subbed channels:{" "}
               </h1>

               <div className="flex items-center gap-2 ml-2">
                  {channels.slice(0, 3).map((channel) => (
                     <Link key={channel._id} href={`/profile/${channel.username}`}>
                        <Image
                           src={channel.avatar}
                           alt={channel.username}
                           width={30}
                           height={30}
                           className="w-10 h-10 rounded-full"
                        />
                     </Link>
                  ))}

                  <Button
                     variant="secondary"
                     className="text-muted-foreground ml-auto p-2"
                     asChild
                     size="sm"
                  >
                     <Link
                        href="/subscriptions/channels"
                        className="flex items-center gap-1"
                     >
                        View all <ArrowUpRight />{" "}
                     </Link>
                  </Button>
               </div>
            </div>

            {videos.length === 0 && (
               <div className="text-center text-muted-foreground mt-5">
                  Your subscribed channels have not uploaded any videos yet.
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
                     disabled={currentPage === 1 || isLoading}
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
                     disabled={currentPage === totalPages || isLoading}
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
