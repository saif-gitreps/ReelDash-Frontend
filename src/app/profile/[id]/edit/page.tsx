"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function EditProfile({ params }: { params: { username: string } }) {
   const [username, setUsername] = useState(params.username);
   const [bio, setBio] = useState("");
   const [email, setEmail] = useState("");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Implement profile update logic
      console.log("Profile updated:", { username, bio, email });
   };

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label htmlFor="username">Username</Label>
               <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary text-foreground"
               />
            </div>
            <div>
               <Label htmlFor="bio">Bio</Label>
               <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-secondary text-foreground"
               />
            </div>
            <div>
               <Label htmlFor="email">Email</Label>
               <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary text-foreground"
               />
            </div>
            <div className="space-y-2">
               <Label>Profile Photo</Label>
               <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
               >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Profile Photo
               </Button>
            </div>
            <div className="space-y-2">
               <Label>Cover Photo</Label>
               <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
               >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Cover Photo
               </Button>
            </div>
            <Button type="submit" className="yellow-accent-bg w-full">
               Save Changes
            </Button>
         </form>
      </div>
   );
}
