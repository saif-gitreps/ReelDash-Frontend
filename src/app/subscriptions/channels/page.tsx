"use client";

import AuthLayer from "@/app/components/AuthLayer";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useGetSubscribedChannels } from "@/hooks/api/subscription/useGetSubbedChannels";
import { useSubOrUnsubChannel } from "@/hooks/api/subscription/useToggleSub";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { UserMinus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Page() {
   const { data, isLoading } = useGetSubscribedChannels();
   const { user } = useAuth();
   const queryClient = useQueryClient();

   const { mutate: toggleSubscription, isPending: isToggleSubscriptionPending } =
      useSubOrUnsubChannel();

   const handleSubscribe = () => {
      toggleSubscription(user?._id as string, {
         onSuccess: () => {
            toast.success("Unsubscribed successfully");

            queryClient.invalidateQueries({
               queryKey: ["subscribedChannels", ,],
            });
         },
         onError: (error) => {
            toast.error("Error unsubscribing" + error.message);
         },
      });
   };

   const channels = data?.data || [];

   if (isLoading && channels === undefined) {
      return <Loading />;
   }

   return (
      <AuthLayer isProtected>
         <div className="container mx-auto p-4 bg-background text-foreground">
            <div className="py-3">
               <h1 className="text-muted-foreground font-bold sm:flex items-center hidden mb-2">
                  Channels you have subscribed to:{" "}
               </h1>

               {channels.length === 0 ? (
                  <span className="text-muted-foreground">
                     You have not subscribed to any channels yet
                  </span>
               ) : (
                  <div className="space-y-1">
                     {channels.map((channel) => (
                        <div
                           key={channel._id}
                           className="bg-secondary flex items-center justify-between rounded-lg p-2 gap-2"
                        >
                           <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                 <Image
                                    src={channel.avatar}
                                    alt={channel.username}
                                    width={48}
                                    height={48}
                                    className="rounded-full w-12 h-12"
                                 />
                                 <div className="space-y-1">
                                    <div className="font-bold hover:opacity-70">
                                       @
                                       <Link href={`/profile/${channel.username}`}>
                                          {channel.username}
                                       </Link>
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                       {channel.fullname}
                                    </div>
                                 </div>
                              </div>
                              <div className="text-muted-foreground text-xs">
                                 Subbed at:{" "}
                                 <span className="font-semibold">
                                    {new Date(channel.createdAt).toDateString()}
                                 </span>
                              </div>
                           </div>

                           <Button
                              onClick={handleSubscribe}
                              disabled={isToggleSubscriptionPending}
                              variant={"destructive"}
                           >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Unsubscribe
                           </Button>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </AuthLayer>
   );
}
