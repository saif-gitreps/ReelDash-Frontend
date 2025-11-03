"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUpdateUserAvatar } from "@/features/user/api/useUpdateUserAvatar";
import { useUpdateUserCoverImage } from "@/features/user/api/useUpdateUserCoverImage";
import { useGetAllVideos } from "@/features/videos/api/useGetAllVideos";
import FeedVideoCard from "@/features/videos/components/FeedVideoCard";
import { useWatchHistory } from "@/features/user/api/useWatchHistory";
import { useUserChannelProfile } from "@/features/user/api/useUserChannelProfile";
import { useSubOrUnsubChannel } from "@/features/subscription/api/useToggleSub";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useIsSubscribed } from "@/features/subscription/api/useIsSubscribed";
import Loader from "@/components/Loader";

const VIDEOS_PER_PAGE = 4;

export default function UserProfile() {
   const params = useParams();
   const { isAuthenticated, user } = useAuth();
   const queryClient = useQueryClient();
   const username = params.username;
   const { data: userChannelProfileData, isLoading } = useUserChannelProfile(
      username as string
   );
   const [historyPage, setHistoryPage] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);
   const { data: isSubscribedData } = useIsSubscribed(
      userChannelProfileData?.data._id as string
   );
   const isSubscribed = isSubscribedData?.data;

   const { data: channelVideosData, isLoading: isChannelVideosLoading } = useGetAllVideos(
      {
         page: currentPage,
         limit: VIDEOS_PER_PAGE,
         username: username as string,
      }
   );

   const channelVideos = channelVideosData?.data.videos || [];
   const totalChannelVideos = channelVideosData?.data.totalVideos || 0;
   const totalChannelPages = Math.ceil(totalChannelVideos / VIDEOS_PER_PAGE);

   const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalChannelPages));
   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

   const { data: watchHistoryData, isLoading: isWatchHistoryLoading } = useWatchHistory({
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

               queryClient.invalidateQueries({
                  queryKey: ["userChannelProfile", username as string],
               });
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

               queryClient.invalidateQueries({
                  queryKey: ["userChannelProfile", username as string],
               });
            },
            onError: (error) => {
               toast.error("Error updating cover image" + error.message);
            },
         });
      }
   };

   const { mutate: toggleSubscription, isPending: isToggleSubscriptionPending } =
      useSubOrUnsubChannel();

   const handleSubscribe = () => {
      toggleSubscription(userChannelProfileData?.data._id as string, {
         onSuccess: () => {
            toast.success(
               isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully"
            );

            queryClient.invalidateQueries({
               queryKey: ["userChannelProfile", username as string],
            });

            queryClient.invalidateQueries({
               queryKey: ["isSubscribed", userChannelProfileData?.data._id as string],
            });
         },
         onError: () => {
            toast.error(isSubscribed ? "Error unsubscribing" : "Error subscribing");
         },
      });
   };

   if (isLoading) {
      return <Loader />;
   }

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         <div className="relative w-full h-72 mb-16">
            {isCoverImageUpdating ? (
               <Loader />
            ) : (
               <Image
                  src={
                     userChannelProfileData?.data.coverImage ||
                     "https://res.cloudinary.com/dnhpmyqsm/image/upload/v1738056895/gmq2yeiaofahtr5wvv0m.png"
                  }
                  alt={`${username}'s cover photo`}
                  fill
                  className="rounded-lg object-cover object-center"
               />
            )}

            {isAuthenticated && user?.username === username && (
               <>
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
                     className="absolute bottom-0 right-0 opacity-75 bg-background/50 hover:bg-background/75"
                     onClick={() => document.getElementById("coverImageUpload")?.click()}
                     disabled={isCoverImageUpdating}
                  >
                     <Upload className="h-4 w-4" />
                  </Button>
               </>
            )}

            <div className="absolute -bottom-16 left-4 w-40 h-40 rounded-full overflow-hidden border-4 border-background">
               {isAvatarUpdating ? (
                  <Loader />
               ) : (
                  <Image
                     src={
                        userChannelProfileData?.data.avatar ||
                        "https://res.cloudinary.com/dnhpmyqsm/image/upload/v1737893749/image_2_bdhok6.png"
                     }
                     alt={`${username}'s profile picture`}
                     fill
                  />
               )}

               {isAuthenticated && user?.username === username && (
                  <>
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
                        className="absolute bottom-2 right-4 opacity-75 bg-background/50 hover:bg-background/75 rounded-full"
                        onClick={() => document.getElementById("avatarUpload")?.click()}
                        disabled={isAvatarUpdating}
                     >
                        <Upload className="h-2 w-2" />
                     </Button>
                  </>
               )}
            </div>
         </div>

         <div className="flex justify-between items-center mb-4">
            <div>
               <div className="text-2xl font-bold">
                  {username}{" "}
                  <span className="text-xl text-muted-foreground">
                     &#10088;{userChannelProfileData?.data.fullname}&#10089;
                  </span>
               </div>

               <div className="text-muted-foreground">
                  {userChannelProfileData?.data.subscribersCount} subscribers
               </div>
            </div>

            {!isAuthenticated && (
               <div className="text-lg text-muted-foreground">
                  <Button variant="outline">
                     <Link href="/login">Login</Link> to subscribe
                  </Button>
               </div>
            )}

            {isAuthenticated && (
               <div className="space-x-2">
                  <Button
                     onClick={handleSubscribe}
                     disabled={isToggleSubscriptionPending}
                     variant={isSubscribed ? "destructive" : "outline"}
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

                  {user?.username === username && (
                     <Link href="/upload">
                        <Button variant="secondary">
                           <Upload className="w-4 h-4 mr-2" />
                           Upload Video
                        </Button>
                     </Link>
                  )}
               </div>
            )}
         </div>

         <Tabs defaultValue="uploaded" className="w-full">
            <TabsList>
               <TabsTrigger value="uploaded">Uploaded Videos</TabsTrigger>
               {isAuthenticated && user?.username === username && (
                  <TabsTrigger value="history">Watch History</TabsTrigger>
               )}
            </TabsList>

            <TabsContent value="uploaded">
               <div className="">
                  {isChannelVideosLoading ? (
                     <Loader />
                  ) : (
                     <>
                        {channelVideos?.length === 0 && !isChannelVideosLoading && (
                           <div className="text-center text-muted-foreground">
                              No videos found
                           </div>
                        )}

                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                           {channelVideos.map((video) => (
                              <FeedVideoCard video={video} key={video._id} onProfile />
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

            {isAuthenticated && user?.username === username && (
               <TabsContent value="history">
                  <div>
                     {isWatchHistoryLoading ? (
                        <Loader />
                     ) : (
                        <>
                           {paginatedHistory?.length === 0 && !isWatchHistoryLoading && (
                              <div className="text-center text-muted-foreground">
                                 No history found
                              </div>
                           )}

                           <div className="space-y-1">
                              {paginatedHistory.map((video) => (
                                 <div
                                    key={video._id}
                                    className="bg-secondary flex items-center justify-between rounded-lg p-2 gap-2"
                                 >
                                    <div className="flex items-center gap-2">
                                       <Link href={`/video/${video._id}`}>
                                          <Image
                                             src={video.thumbnail}
                                             alt={video.title}
                                             width={120}
                                             height={90}
                                             className="w-20 h-20 rounded-md"
                                          />
                                       </Link>
                                       <div className="space-y-1">
                                          <Link
                                             href={`/video/${video._id}`}
                                             className="font-semibold text-center mb-2 hover:opacity-70"
                                          >
                                             {video.title}
                                          </Link>
                                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                                             <Image
                                                src={video?.owner.avatar}
                                                alt="owner avatar"
                                                width={30}
                                                height={30}
                                                className="w-4 h-4 rounded-full"
                                             />
                                             <Link
                                                className="hover:opacity-70"
                                                href={`/profile/${video?.owner?.username}`}
                                             >
                                                @{video?.owner?.username}
                                             </Link>
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                             {new Date(video.createdAt).toDateString()}
                                          </div>
                                       </div>
                                    </div>
                                    {/* <Button
                                       variant="ghost"
                                       onClick={() => {}}
                                       className="text-destructive hover:text-destructive"
                                       disabled={false}
                                    >
                                       {false ? (
                                          <Loader2
                                             className="animate-spin stroke-white"
                                             size={32}
                                          />
                                       ) : (
                                          <Trash2 size={32} />
                                       )}
                                    </Button> */}
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
            )}
         </Tabs>
      </div>
   );
}
