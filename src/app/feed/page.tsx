"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/navbar";

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

export default function Feed() {
   return (
      <div className="min-h-screen bg-gray-100 pb-16">
         <Navbar />
         <div className="container mx-auto p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {dummyVideos.map((video) => (
               <Link
                  href={`/video/${video.id}`}
                  key={video.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
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
                     <p className="text-gray-600">{video.description}</p>
                     <div className="mt-2 text-sm text-gray-500">
                        {video.likes} likes · {video.comments} comments
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
}
