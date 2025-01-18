"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   UserPlus,
   UserMinus,
   Upload,
   Edit,
   ChevronLeft,
   ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfileProps {
   params: { username: string };
}

const ITEMS_PER_PAGE = 6;

const dummyVideos = [
   { id: "1", title: "My first video", views: 1000 },
   { id: "2", title: "Cooking tutorial", views: 2000 },
   { id: "3", title: "Travel vlog", views: 1500 },
   { id: "4", title: "Gaming stream", views: 3000 },
   { id: "5", title: "Product review", views: 2500 },
   { id: "6", title: "Music cover", views: 1800 },
   { id: "7", title: "Fitness routine", views: 2200 },
   { id: "8", title: "Tech unboxing", views: 1900 },
];

const dummyWatchHistory = [
   { id: "1", title: "Funny cat videos", creator: "CatLover" },
   { id: "2", title: "How to make sushi", creator: "ChefMaster" },
   { id: "3", title: "Top 10 movies of 2023", creator: "FilmCritic" },
   { id: "4", title: "Learn JavaScript in 1 hour", creator: "CodeGuru" },
   { id: "5", title: "Beautiful places in nature", creator: "TravelExplorer" },
   { id: "6", title: "DIY home decor ideas", creator: "CraftyCreator" },
   { id: "7", title: "Beginner's guide to photography", creator: "PhotoPro" },
   { id: "8", title: "Easy workout at home", creator: "FitnessFanatic" },
];

export default function UserProfile({ params }: UserProfileProps) {
   const { username } = params;
   const [isSubscribed, setIsSubscribed] = useState(false);
   const [subscriberCount, setSubscriberCount] = useState(1000);
   const [uploadedPage, setUploadedPage] = useState(1);
   const [historyPage, setHistoryPage] = useState(1);

   const handleSubscribe = () => {
      setIsSubscribed(!isSubscribed);
      setSubscriberCount((prevCount) => (isSubscribed ? prevCount - 1 : prevCount + 1));
   };

   const totalUploadedPages = Math.max(1, Math.ceil(dummyVideos.length / ITEMS_PER_PAGE));
   const totalHistoryPages = Math.max(
      1,
      Math.ceil(dummyWatchHistory.length / ITEMS_PER_PAGE)
   );

   const paginatedVideos = dummyVideos.slice(
      (uploadedPage - 1) * ITEMS_PER_PAGE,
      uploadedPage * ITEMS_PER_PAGE
   );
   const paginatedHistory = dummyWatchHistory.slice(
      (historyPage - 1) * ITEMS_PER_PAGE,
      historyPage * ITEMS_PER_PAGE
   );

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
            <Button
               variant="outline"
               size="icon"
               className="absolute top-2 right-2 bg-background/50 hover:bg-background/75"
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
               <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 bg-background/50 hover:bg-background/75"
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
               <div className="grid grid-cols-3 gap-4">
                  {paginatedVideos.map((video) => (
                     <div
                        key={video.id}
                        className="bg-secondary h-40 flex flex-col items-center justify-center rounded-lg p-4"
                     >
                        <h3 className="font-semibold text-center mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">
                           {video.views} views
                        </p>
                     </div>
                  ))}
               </div>
               <div className="flex justify-between items-center mt-4">
                  <Button
                     onClick={() => setUploadedPage((prev) => Math.max(prev - 1, 1))}
                     disabled={uploadedPage === 1}
                     className="yellow-accent-bg"
                  >
                     <ChevronLeft className="w-4 h-4 mr-2" />
                     Previous
                  </Button>
                  <span>
                     Page {uploadedPage} of {totalUploadedPages}
                  </span>
                  <Button
                     onClick={() =>
                        setUploadedPage((prev) => Math.min(prev + 1, totalUploadedPages))
                     }
                     disabled={uploadedPage === totalUploadedPages}
                     className="yellow-accent-bg"
                  >
                     Next
                     <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </TabsContent>
            <TabsContent value="history">
               <div className="grid grid-cols-3 gap-4">
                  {paginatedHistory.map((video) => (
                     <div
                        key={video.id}
                        className="bg-secondary h-40 flex flex-col items-center justify-center rounded-lg p-4"
                     >
                        <h3 className="font-semibold text-center mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">
                           by {video.creator}
                        </p>
                     </div>
                  ))}
               </div>
               <div className="flex justify-between items-center mt-4">
                  <Button
                     onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))}
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
                     onClick={() =>
                        setHistoryPage((prev) => Math.min(prev + 1, totalHistoryPages))
                     }
                     disabled={historyPage === totalHistoryPages}
                     className="yellow-accent-bg"
                  >
                     Next
                     <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
