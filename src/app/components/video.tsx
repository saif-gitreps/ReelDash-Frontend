"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video as VideoType } from "@/hooks/api/videos/useGetReelVideo";
import Image from "next/image";
import { useLikeUnlikeVideo } from "@/hooks/api/videos/useToggleLike";
import { useCreateCommentOnVideo } from "@/hooks/api/comments/useCreateComment";
import { useDeleteComment } from "@/hooks/api/comments/useDeleteComment";
import Link from "next/link";

import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useIsLiked } from "@/hooks/api/videos/useIsLikedVideo";
import { useAuth } from "@/hooks/useAuth";

interface VideoProps {
   video: VideoType;
}

export default function Video({ video }: VideoProps) {
   const [showComments, setShowComments] = useState(false);
   const [newComment, setNewComment] = useState("");
   const queryClient = useQueryClient();
   const { isAuthenticated, user } = useAuth();

   const { data: isLiked } = useIsLiked(video._id);
   const { mutate: toggleLike, isPending: isToggleLikePending } = useLikeUnlikeVideo();
   const { mutate: addComment, isPending: isAddCommentPending } =
      useCreateCommentOnVideo();
   const { mutate: deleteComment, isPending: isDeleteCommentPending } =
      useDeleteComment();

   const handleToggleLike = () => {
      toggleLike(video._id, {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isLiked", video._id] });
            queryClient.invalidateQueries({ queryKey: ["getVideo", video._id] });
         },
         onError: (error) => {
            toast.error(`Error toggling like: ${error.message}`);
         },
      });
   };

   const handleAddComment = () => {
      const trimmedComment = newComment.trim();
      if (!trimmedComment) return;

      addComment(
         {
            videoId: video._id,
            data: { content: trimmedComment },
         },
         {
            onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["getVideo", video._id] });
               setNewComment("");
            },
            onError: (error) => {
               toast.error(`Error adding comment: ${error.message}`);
            },
         }
      );
   };

   const handleDeleteComment = (commentId: string) => {
      if (!commentId) return;

      deleteComment(commentId, {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getVideo", video._id] });
            toast.success("Comment deleted successfully");
         },
         onError: (error) => {
            toast.error(`Error deleting comment: ${error.message}`);
         },
      });
   };

   return (
      <div className="relative w-full h-screen bg-background">
         <video
            src={video.videoFile}
            className="w-full h-full object-contain"
            loop
            autoPlay
            muted
            playsInline
            controls={false}
         />

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

         <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
            <ActionButton
               Icon={Heart}
               isActive={isLiked?.data}
               isDisabled={isToggleLikePending || !isAuthenticated}
               count={video.numberOfLikes}
               onClick={handleToggleLike}
            />

            <ActionButton
               Icon={MessageCircle}
               isActive={showComments}
               count={video.commentsOnTheVideo.length}
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

         {showComments && (
            <CommentsSection
               comments={video.commentsOnTheVideo}
               onClose={() => setShowComments(false)}
               onAddComment={handleAddComment}
               onDeleteComment={handleDeleteComment}
               newComment={newComment}
               isDeleteCommentPending={isDeleteCommentPending}
               isAddCommentPending={isAddCommentPending}
               setNewComment={setNewComment}
               isAuthenticated={isAuthenticated}
               username={user?.username as string}
            />
         )}
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
            <Icon className={isActive ? "fill-current" : ""} size={32} />
         </Button>
         {count !== undefined && <span className="text-white text-base">{count}</span>}
      </div>
   );
}

interface CommentsSectionProps {
   comments: VideoType["commentsOnTheVideo"];
   onClose: () => void;
   onAddComment: () => void;
   onDeleteComment: (id: string) => void;
   newComment: string;
   isDeleteCommentPending: boolean;
   isAddCommentPending: boolean;
   setNewComment: (comment: string) => void;
   isAuthenticated: boolean;
   username: string;
}

function CommentsSection({
   comments,
   onClose,
   onAddComment,
   onDeleteComment,
   isDeleteCommentPending,
   isAddCommentPending,
   newComment,
   setNewComment,
   isAuthenticated,
   username,
}: CommentsSectionProps) {
   return (
      <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 h-2/3 rounded-t-xl">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-foreground">Comments</h3>
            <Button
               variant="ghost"
               size="icon"
               onClick={onClose}
               className="text-foreground"
            >
               <X className="h-6 w-6" />
            </Button>
         </div>

         <ScrollArea className="h-[calc(100%-8rem)] mb-4">
            {comments.map((comment) => (
               <div
                  key={comment._id || comment.createdAt}
                  className="flex justify-between items-start mb-2 p-2 bg-muted rounded-md"
               >
                  <div className="flex items-start space-x-2">
                     <Image
                        src={comment.owner.avatar}
                        alt={comment.owner.username}
                        className="w-6 h-6 rounded-full"
                        width={24}
                        height={24}
                     />
                     <div>
                        <p className="font-semibold text-sm">{comment.owner.username}</p>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                     </div>
                  </div>

                  {isAuthenticated && comment.owner.username === username && (
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={isDeleteCommentPending}
                     >
                        <Trash2 className="h-6 w-6" />
                     </Button>
                  )}
               </div>
            ))}
         </ScrollArea>

         <div className="flex gap-2">
            {isAuthenticated && (
               <>
                  <Input
                     placeholder="Add a comment..."
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     className="flex-grow"
                     onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !isAddCommentPending) {
                           e.preventDefault();
                           onAddComment();
                        }
                     }}
                  />
                  <Button
                     onClick={onAddComment}
                     disabled={isAddCommentPending || !newComment.trim()}
                  >
                     Post
                  </Button>
               </>
            )}
         </div>
      </div>
   );
}
