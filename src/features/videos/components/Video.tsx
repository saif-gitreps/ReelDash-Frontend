"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Video as VideoType } from "@/features/videos/hooks/useGetReelVideo";
import Image from "next/image";
import { useLikeUnlikeVideo } from "@/features/videos/hooks/useToggleLike";
import Link from "next/link";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useIsLiked } from "@/features/videos/hooks/useIsLikedVideo";
import { useAuth } from "@/hooks/useAuth";
import EnhancedVideo from "./EnhancedVideo";
import { useGetLikesOnAVideo } from "@/features/videos/hooks/useGetLikesOnVideo";
import Loading from "../../../components/Loading";
import { CommentsSection } from "../../comment-section/components/CommentSection";
import { useGetCommentsOnVideo } from "@/features/comment-section/hooks/useGetComments";

interface VideoProps {
   video: VideoType;
}

export default function Video({ video }: VideoProps) {
   const [showComments, setShowComments] = useState(false);
   const queryClient = useQueryClient();
   const { isAuthenticated } = useAuth();
   const { data: isLiked } = useIsLiked(video._id);
   const { data: likesCount } = useGetLikesOnAVideo(video._id);
   const { mutate: toggleLike, isPending: isToggleLikePending } = useLikeUnlikeVideo();
   const { data: comments, isLoading: isCommentsLoading } = useGetCommentsOnVideo(
      video._id
   );

   const handleToggleLike = () => {
      toggleLike(video._id, {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isLiked", video._id] });
            queryClient.invalidateQueries({ queryKey: ["likesOnVideo", video._id] });
         },
         onError: (error) => {
            toast.error(`Error toggling like: ${error.message}`);
         },
      });
   };

   return (
      <div className="relative w-full h-screen bg-background">
         <EnhancedVideo src={video.videoFile} />

         <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
            <div className="flex items-center space-x-2 mb-2">
               <Image
                  src={video.owner.avatar}
                  alt={video.owner.username}
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
               />
               <Link
                  href={`/profile/${video.owner.username}`}
                  className="text-lg font-bold hover:opacity-70"
               >
                  @{video.owner.username}
               </Link>
            </div>
            <p className="text-sm">{video.title}</p>
         </div>

         <div className="absolute right-4 bottom-10 flex flex-col items-center space-y-1">
            <ActionButton
               Icon={Heart}
               isActive={isLiked?.data}
               isDisabled={isToggleLikePending || !isAuthenticated}
               count={likesCount?.data}
               onClick={handleToggleLike}
            />

            <ActionButton
               Icon={MessageCircle}
               isActive={showComments}
               count={comments?.data?.length}
               onClick={() => setShowComments(true)}
            />

            <ActionButton
               Icon={Share2}
               onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
               }}
            />
         </div>

         {showComments &&
            (isCommentsLoading ? (
               <Loading />
            ) : (
               <CommentsSection
                  comments={comments?.data || []}
                  onClose={() => setShowComments(false)}
                  videoId={video._id}
               />
            ))}
      </div>
   );
}

interface ActionButtonProps {
   Icon: React.ComponentType<{ className?: string; size?: number }>;
   isActive?: boolean;
   count?: number;
   isDisabled?: boolean;
   onClick: () => void;
}

function ActionButton({ Icon, isActive, count, onClick, isDisabled }: ActionButtonProps) {
   return (
      <div className="flex flex-col items-center">
         <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={isDisabled}
            className="text-white hover:text-white/80"
         >
            <Icon className={isActive ? "fill-red-500" : ""} size={32} />
         </Button>
         {count !== undefined && <span className="text-white text-base">{count}</span>}
      </div>
   );
}
