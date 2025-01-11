"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Trash2 } from "lucide-react";

interface Post {
   id: string;
   username: string;
   content: string;
   isOwnPost: boolean;
}

const dummyPosts: Post[] = [
   { id: "1", username: "user1", content: "Check out my new video!", isOwnPost: true },
   { id: "2", username: "user2", content: "Just uploaded a tutorial", isOwnPost: false },
   { id: "3", username: "user3", content: "Live streaming in 1 hour!", isOwnPost: false },
];

export default function Updates() {
   const [posts, setPosts] = useState(dummyPosts);
   const [showOwnPosts, setShowOwnPosts] = useState(false);

   const filteredPosts = showOwnPosts ? posts.filter((post) => post.isOwnPost) : posts;

   const handleDelete = (id: string) => {
      setPosts(posts.filter((post) => post.id !== id));
   };

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Updates</h1>
            <div className="space-x-2">
               <Button
                  onClick={() => setShowOwnPosts(!showOwnPosts)}
                  className="yellow-accent-bg"
               >
                  <Filter className="w-4 h-4 mr-2" />
                  {showOwnPosts ? "Show All" : "Show My Posts"}
               </Button>
               <Link href="/updates/new">
                  <Button className="yellow-accent-bg">
                     <Plus className="w-4 h-4 mr-2" />
                     New Post
                  </Button>
               </Link>
            </div>
         </div>
         <div className="space-y-4">
            {filteredPosts.map((post) => (
               <div
                  key={post.id}
                  className="bg-secondary p-4 rounded-lg flex justify-between items-start"
               >
                  <div>
                     <p className="font-semibold">{post.username}</p>
                     <p>{post.content}</p>
                  </div>
                  {post.isOwnPost && (
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        className="text-destructive hover:text-destructive"
                     >
                        <Trash2 className="w-4 h-4" />
                     </Button>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
}
