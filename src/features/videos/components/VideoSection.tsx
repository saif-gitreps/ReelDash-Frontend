"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useLikeUnlikeVideo } from "@/features/videos/api/useToggleLike";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useIsLiked } from "@/features/videos/api/useIsLikedVideo";
import { useAuth } from "@/hooks/useAuth";
import { useGetLikesOnAVideo } from "@/features/videos/api/useGetLikesOnVideo";
import Loading from "../../../components/Loading";
import { CommentsSection } from "../../comment-section/components/CommentSection";
import { useGetCommentsOnVideo } from "../../comment-section/api/useGetComments";

interface VideoSectionProps {
   videoId: string;
   videoFile: string;
}

export default function VideoSection({ videoId }: VideoSectionProps) {
   const [showComments, setShowComments] = useState(false);
   const queryClient = useQueryClient();
   const { isAuthenticated } = useAuth();
   const { data: isLiked } = useIsLiked(videoId);
   const { data: likesCount } = useGetLikesOnAVideo(videoId);
   const { mutate: toggleLike, isPending: isToggleLikePending } = useLikeUnlikeVideo();
   const { data: comments, isLoading: isCommentsLoading } =
      useGetCommentsOnVideo(videoId);

   const handleToggleLike = () => {
      toggleLike(videoId, {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isLiked", videoId] });
            queryClient.invalidateQueries({ queryKey: ["likesOnVideo", videoId] });
         },
         onError: (error) => {
            toast.error(`Error toggling like: ${error.message}`);
         },
      });
   };

   return (
      <div className="space-x-1 w-full">
         <div className="flex justify-between items-center">
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
                  videoId={videoId}
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
      <div className="flex items-center justify-center bg-white">
         <button
            onClick={onClick}
            disabled={isDisabled}
            className="flex items-center justify-center bg-black"
         >
            <Icon className={`${isActive ? "fill-red-500" : "fill-red-500"}`} size={28} />
         </button>

         {count !== undefined && <span className="text-white text-xs">{count}</span>}
      </div>
   );
}
