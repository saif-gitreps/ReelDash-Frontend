"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";

const dummyVideos = [
   {
      id: "1",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      username: "user1",
      description: "Never gonna give you up",
      likes: 100,
      comments: 50,
      isSubscribed: true,
   },
   {
      id: "2",
      url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      username: "user2",
      description: "Me at the zoo",
      likes: 200,
      comments: 75,
      isSubscribed: false,
   },
   {
      id: "3",
      url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      username: "user3",
      description: "Despacito",
      likes: 150,
      comments: 60,
      isSubscribed: true,
   },
   {
      id: "4",
      url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      username: "user4",
      description: "Gangnam Style",
      likes: 300,
      comments: 100,
      isSubscribed: false,
   },
   {
      id: "5",
      url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
      username: "user5",
      description: "Shape of You",
      likes: 250,
      comments: 80,
      isSubscribed: true,
   },
   {
      id: "6",
      url: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
      username: "user6",
      description: "Uptown Funk",
      likes: 180,
      comments: 70,
      isSubscribed: false,
   },
];

const VIDEOS_PER_PAGE = 3;

export default function Feed() {
   const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);

   const filteredVideos = showSubscribedOnly
      ? dummyVideos.filter((video) => video.isSubscribed)
      : dummyVideos;
   const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
   const paginatedVideos = filteredVideos.slice(
      (currentPage - 1) * VIDEOS_PER_PAGE,
      currentPage * VIDEOS_PER_PAGE
   );

   const nextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   };

   const prevPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
   };

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Feed</h1>
            <div className="flex items-center space-x-2">
               <Switch
                  id="subscribed-only"
                  checked={showSubscribedOnly}
                  onCheckedChange={setShowSubscribedOnly}
               />
               <Label htmlFor="subscribed-only">Show subscribed only</Label>
            </div>
         </div>
         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {paginatedVideos.map((video) => (
               <Link
                  href={`/video/${video.id}`}
                  key={video.id}
                  className="bg-secondary rounded-lg shadow-md overflow-hidden"
               >
                  <div className="relative h-48">
                     <Image
                        src={`https://img.youtube.com/vi/${
                           video.url.split("v=")[1]
                        }/0.jpg`}
                        alt={video.description}
                        layout="fill"
                        objectFit="cover"
                     />
                  </div>
                  <div className="p-4">
                     <h3 className="font-bold text-lg mb-2">{video.username}</h3>
                     <p className="text-muted-foreground">{video.description}</p>
                     <div className="mt-2 text-sm text-muted-foreground">
                        {video.likes} likes · {video.comments} comments
                     </div>
                  </div>
               </Link>
            ))}
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
