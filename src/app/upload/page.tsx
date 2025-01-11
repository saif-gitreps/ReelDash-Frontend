"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "../components/navbar";

export default function UploadVideo() {
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [videoFile, setVideoFile] = useState<File | null>(null);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Implement video upload logic
      console.log("Uploading video:", { title, description, videoFile });
   };

   return (
      <div className="container mx-auto p-4 pb-16">
         <Navbar />
         <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label htmlFor="title">Title</Label>
               <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
               />
            </div>
            <div>
               <Label htmlFor="description">Description</Label>
               <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
               />
            </div>
            <div>
               <Label htmlFor="video">Video File</Label>
               <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required
               />
            </div>
            <Button type="submit">Upload Video</Button>
         </form>
      </div>
   );
}
