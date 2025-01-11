"use client";

import { useParams } from "next/navigation";
import Video from "../../components/video";
import Navbar from "../../components/navbar";

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

export default function SingleVideo() {
   const params = useParams();
   const videoId = params.id as string;
   const video = dummyVideos.find((v) => v.id === videoId);

   if (!video) {
      return <div>Video not found</div>;
   }

   return (
      <div className="h-screen w-full overflow-hidden relative">
         <Navbar />
         <Video {...video} />
      </div>
   );
}
