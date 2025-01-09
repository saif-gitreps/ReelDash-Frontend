"use client";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Video from "../components/video";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";
import Navbar from "../components/navbar";
import Link from "next/link";

const dummyVideos = [
   {
      id: "1",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      username: "user1",
      description: "Never gonna give you up",
      likes: 100,
      comments: 50,
   },
   {
      id: "2",
      url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      username: "user2",
      description: "Me at the zoo",
      likes: 200,
      comments: 75,
   },
   {
      id: "3",
      url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      username: "user3",
      description: "Despacito",
      likes: 150,
      comments: 60,
   },
];

export default function Home() {
   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

   const nextVideo = () =>
      setCurrentVideoIndex((prev) => (prev + 1) % dummyVideos.length);
   const prevVideo = () =>
      setCurrentVideoIndex(
         (prev) => (prev - 1 + dummyVideos.length) % dummyVideos.length
      );

   const handlers = useSwipeable({
      onSwipedUp: nextVideo,
      onSwipedDown: prevVideo,
   });

   return (
      <div className="h-screen w-full overflow-hidden relative">
         <Navbar />
         <div {...handlers} className="h-full">
            <Video
               {...dummyVideos[currentVideoIndex]}
               key={dummyVideos[currentVideoIndex].id}
            />
         </div>
         <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            onClick={prevVideo}
         >
            <ChevronLeft className="h-6 w-6" />
         </Button>
         <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={nextVideo}
         >
            <ChevronRight className="h-6 w-6" />
         </Button>
         <Link href={`/video/${dummyVideos[currentVideoIndex].id}/stats`}>
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-4 right-4 bg-black bg-opacity-50 text-white"
            >
               <BarChart2 className="h-6 w-6" />
            </Button>
         </Link>
      </div>
   );
}
