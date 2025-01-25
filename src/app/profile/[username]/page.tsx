"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUpdateUserAvatar } from "@/hooks/api/users/useUpdateUserAvatar";
import { useUpdateUserCoverImage } from "@/hooks/api/users/useUpdateUserCoverImage";
import { useGetAllVideos } from "@/hooks/api/videos/useGetAllVideos";
import FeedVideoCard from "@/app/components/FeedVideoCard";
import Loading from "@/app/components/Loading";
import { useWatchHistory } from "@/hooks/api/users/useWatchHistory";

const VIDEOS_PER_PAGE = 3;

export default function UserProfile() {
   const params = useParams();
   const username = params.username;
   const [isSubscribed, setIsSubscribed] = useState(false);
   const [subscriberCount, setSubscriberCount] = useState(1000);
   const [historyPage, setHistoryPage] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);

   const {
      data: channelVideosData,
      isLoading: isChannelVideosLoading,
      error: channelVideosError,
   } = useGetAllVideos({
      page: currentPage,
      limit: VIDEOS_PER_PAGE,
      username: username as string,
   });

   const channelVideos = channelVideosData?.data.videos || [];
   const totalChannelVideos = channelVideosData?.data.totalVideos || 0;
   const totalChannelPages = Math.ceil(totalChannelVideos / VIDEOS_PER_PAGE);

   const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalChannelPages));
   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

   const {
      data: watchHistoryData,
      isLoading: isWatchHistoryLoading,
      error: watchHistoryError,
   } = useWatchHistory({
      limit: 10,
      page: historyPage,
   });

   const paginatedHistory = watchHistoryData?.data.watchHistory || [];
   const totalHistoryItems = watchHistoryData?.data.totalWatchHistoryItems || 0;
   const totalHistoryPages = Math.ceil(totalHistoryItems / 10);

   const nextHistoryPage = () =>
      setHistoryPage((prev) => Math.min(prev + 1, totalHistoryPages));
   const prevHistoryPage = () => setHistoryPage((prev) => Math.max(prev - 1, 1));

   const { mutate: updateAvatar, isPending: isAvatarUpdating } = useUpdateUserAvatar();
   const { mutate: updateCoverImage, isPending: isCoverImageUpdating } =
      useUpdateUserCoverImage();

   const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         updateAvatar(file, {
            onSuccess: () => {
               toast.success("Avatar updated successfully");
            },
            onError: (error) => {
               toast.error("Error updating avatar" + error.message);
            },
         });
      }
   };

   const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         updateCoverImage(file, {
            onSuccess: () => {
               toast.success("Cover image updated successfully");
            },
            onError: (error) => {
               toast.error("Error updating cover image" + error.message);
            },
         });
      }
   };

   const handleSubscribe = () => {
      setIsSubscribed(!isSubscribed);
      setSubscriberCount((prevCount) => (isSubscribed ? prevCount - 1 : prevCount + 1));
   };

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         <div className="relative w-full h-48 mb-16">
            <Image
               src={`/placeholder.svg?height=192&width=768`}
               alt={`${username}'s cover photo`}
               layout="fill"
               objectFit="cover"
               className="rounded-lg"
            />
            <input
               type="file"
               accept="image/*"
               className="hidden"
               id="coverImageUpload"
               onChange={handleCoverImageUpload}
               disabled={isCoverImageUpdating}
            />
            <Button
               variant="outline"
               size="icon"
               className="absolute top-2 right-2 bg-background/50 hover:bg-background/75"
               onClick={() => document.getElementById("coverImageUpload")?.click()}
               disabled={isCoverImageUpdating}
            >
               <Upload className="h-4 w-4" />
            </Button>
            <div className="absolute -bottom-16 left-4 w-32 h-32 rounded-full overflow-hidden border-4 border-background">
               <Image
                  src={`/placeholder.svg?height=128&width=128`}
                  alt={`${username}'s profile picture`}
                  width={128}
                  height={128}
               />
               <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatarUpload"
                  onChange={handleAvatarUpload}
                  disabled={isAvatarUpdating}
               />
               <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 bg-background/50 hover:bg-background/75"
                  onClick={() => document.getElementById("avatarUpload")?.click()}
                  disabled={isAvatarUpdating}
               >
                  <Upload className="h-4 w-4" />
               </Button>
            </div>
         </div>

         <div className="flex justify-between items-center mb-4">
            <div>
               <h1 className="text-2xl font-bold">{username}</h1>
               <p className="text-muted-foreground">
                  {subscriberCount.toString()} subscribers
               </p>
            </div>
            <div className="space-x-2">
               <Button
                  onClick={handleSubscribe}
                  variant={isSubscribed ? "outline" : "default"}
                  className={
                     isSubscribed
                        ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        : "yellow-accent-bg"
                  }
               >
                  {isSubscribed ? (
                     <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unsubscribe
                     </>
                  ) : (
                     <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Subscribe
                     </>
                  )}
               </Button>

               <Link href="/upload">
                  <Button className="yellow-accent-bg">
                     <Upload className="w-4 h-4 mr-2" />
                     Upload Video
                  </Button>
               </Link>
            </div>
         </div>

         <Tabs defaultValue="uploaded" className="w-full">
            <TabsList>
               <TabsTrigger value="uploaded">Uploaded Videos</TabsTrigger>
               <TabsTrigger value="history">Watch History</TabsTrigger>
            </TabsList>
            <TabsContent value="uploaded">
               <div className="">
                  {isChannelVideosLoading ? (
                     <Loading />
                  ) : (
                     <>
                        {channelVideos?.length === 0 && !isChannelVideosLoading && (
                           <div className="text-center text-muted-foreground">
                              No videos found
                           </div>
                        )}

                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                           {channelVideos.map((video) => (
                              <FeedVideoCard video={video} key={video._id} />
                           ))}
                        </div>

                        {totalChannelPages > 1 && (
                           <div className="flex justify-between items-center mt-4">
                              <Button
                                 onClick={prevPage}
                                 disabled={currentPage === 1 || isChannelVideosLoading}
                                 className="yellow-accent-bg"
                              >
                                 <ChevronLeft className="w-4 h-4 mr-2" />
                                 Previous
                              </Button>
                              <span>
                                 Page {currentPage} of {totalChannelPages}
                              </span>
                              <Button
                                 onClick={nextPage}
                                 disabled={
                                    currentPage >= totalChannelPages ||
                                    isChannelVideosLoading
                                 }
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
            </TabsContent>

            <TabsContent value="history">
               <div>
                  {isWatchHistoryLoading ? (
                     <Loading />
                  ) : (
                     <>
                        {paginatedHistory?.length === 0 && !isWatchHistoryLoading && (
                           <div className="text-center text-muted-foreground">
                              No history found
                           </div>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                           {paginatedHistory.map((video) => (
                              <div
                                 key={video._id}
                                 className="bg-secondary h-40 flex flex-col items-center justify-center rounded-lg p-4"
                              >
                                 <h3 className="font-semibold text-center mb-2">
                                    {video.title}
                                 </h3>
                                 <p className="text-sm text-muted-foreground">
                                    by {video.owner.username}
                                 </p>
                              </div>
                           ))}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                           <Button
                              onClick={prevHistoryPage}
                              disabled={historyPage === 1}
                              className="yellow-accent-bg"
                           >
                              <ChevronLeft className="w-4 h-4 mr-2" />
                              Previous
                           </Button>
                           <span>
                              Page {historyPage} of {totalHistoryPages}
                           </span>
                           <Button
                              onClick={nextHistoryPage}
                              disabled={historyPage >= totalHistoryPages}
                              className="yellow-accent-bg"
                           >
                              Next
                              <ChevronRight className="w-4 h-4 ml-2" />
                           </Button>
                        </div>
                     </>
                  )}
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
