"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Upload, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfileProps {
   params: { username: string };
}

export default function UserProfile({ params }: UserProfileProps) {
   const { username } = params;
   const [isSubscribed, setIsSubscribed] = useState(false);
   const [subscriberCount, setSubscriberCount] = useState(1000);

   const handleSubscribe = () => {
      setIsSubscribed(!isSubscribed);
      setSubscriberCount(isSubscribed ? subscriberCount - 1 : subscriberCount + 1);
   };

   return (
      <div className="container mx-auto p-4 bg-background text-foreground">
         <div className="relative w-full h-48 mb-16">
            <Image
               src="/placeholder.svg?height=192&width=768"
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
                  src="/placeholder.svg?height=128&width=128"
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
               <p className="text-muted-foreground">{subscriberCount} subscribers</p>
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
               <Link href={`/profile/${username}/edit`}>
                  <Button
                     variant="outline"
                     className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                     <Edit className="w-4 h-4 mr-2" />
                     Edit Profile
                  </Button>
               </Link>
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
                  <div className="bg-secondary h-40 flex items-center justify-center rounded-lg">
                     Video 1
                  </div>
                  <div className="bg-secondary h-40 flex items-center justify-center rounded-lg">
                     Video 2
                  </div>
                  <div className="bg-secondary h-40 flex items-center justify-center rounded-lg">
                     Video 3
                  </div>
               </div>
            </TabsContent>
            <TabsContent value="history">
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary h-40 flex items-center justify-center rounded-lg">
                     Watched Video 1
                  </div>
                  <div className="bg-secondary h-40 flex items-center justify-center rounded-lg">
                     Watched Video 2
                  </div>
                  <div className="bg-secondary h-40 flex items-center justify-center rounded-lg">
                     Watched Video 3
                  </div>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
