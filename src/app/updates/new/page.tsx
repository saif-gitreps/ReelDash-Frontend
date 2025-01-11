"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function NewPost() {
   const [content, setContent] = useState("");
   const router = useRouter();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Implement post creation logic
      console.log("New post:", content);
      router.push("/updates");
   };

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label htmlFor="content">Post Content</Label>
               <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-secondary text-foreground"
                  rows={4}
               />
            </div>
            <Button type="submit" className="yellow-accent-bg w-full">
               Post Update
            </Button>
         </form>
      </div>
   );
}
