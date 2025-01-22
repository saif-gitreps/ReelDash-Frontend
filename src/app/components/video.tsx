"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video as VideoType } from "@/hooks/api/videos/useGetReelVideo";
import Image from "next/image";
import { useLikeUnlikeVideo } from "@/hooks/api/videos/useToggleLike";
import { useCreateCommentOnVideo } from "@/hooks/api/comments/useCreateComment";
import { useDeleteComment } from "@/hooks/api/comments/useDeleteComment";
import Link from "next/link";
import { useIsLiked } from "@/hooks/api/videos/useIsLikedVideo";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface VideoProps {
   video: VideoType;
}

export default function Video({ video }: VideoProps) {
   const [showComments, setShowComments] = useState(false);
   const [newComment, setNewComment] = useState("");
   const queryClient = useQueryClient();

   const { data: isLiked } = useIsLiked(video._id);
   const { mutate: toggleLike } = useLikeUnlikeVideo();
   const { mutate: addComment } = useCreateCommentOnVideo();
   const { mutate: deleteComment } = useDeleteComment();

   const handleTogggleLike = () => {
      toggleLike(video._id, {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isLiked", video._id] });
         },
         onError: (error) => {
            toast.error("Error while toggling like on the video," + error.message);
         },
      });
   };

   const handleAddComment = () => {
      if (newComment.trim()) {
         addComment(
            {
               videoId: video._id,
               data: {
                  content: newComment.trim(),
               },
            },
            {
               onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getVideo", video._id] });
               },
               onError: (error) => {
                  toast.error("Error while adding comment," + error.message);
               },
            }
         );
         setNewComment("");
      }
   };

   const handleDeleteComment = (commentId: string) => {
      deleteComment(commentId);
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
            onClick={() =>
               // Pause the video when clicked
               // TODO: Implement video player controls
               console.log("Video clicked")
            }
         />

         <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
            <div className="flex items-center space-x-2 mb-2">
               <Image
                  src={video.owner.avatar}
                  alt={video.owner.username}
                  className="w-8 h-8 rounded-full"
                  width={8}
                  height={8}
               />
               <h2 className="text-lg font-bold hover:opacity-70">
                  @
                  <Link href={`/profile/${video.owner.username}`}>
                     {video.owner.username}
                  </Link>
               </h2>
            </div>
            <p className="text-sm">{video.title}</p>
         </div>

         {/* Action Buttons */}
         <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
            <ActionButton
               Icon={Heart}
               isActive={isLiked?.data}
               count={video.numberOfLikes}
               onClick={handleTogggleLike}
            />
            <ActionButton
               Icon={MessageCircle}
               isActive={false}
               count={video.commentsOnTheVideo.length}
               onClick={() => setShowComments(true)}
            />
            <ActionButton
               Icon={Share2}
               isActive={false}
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
               setNewComment={setNewComment}
            />
         )}
      </div>
   );
}

// Subcomponents
interface ActionButtonProps {
   Icon: any;
   isActive?: boolean;
   count?: number;
   onClick: () => void;
}

function ActionButton({ Icon, isActive, count, onClick }: ActionButtonProps) {
   return (
      <div className="flex flex-col items-center">
         <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="text-white hover:text-white/80"
         >
            <Icon className={`${isActive ? "fill-current" : ""}`} size={28} />
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
   setNewComment: (comment: string) => void;
}

function CommentsSection({
   comments,
   onClose,
   onAddComment,
   onDeleteComment,
   newComment,
   setNewComment,
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
                  key={comment.createdAt}
                  className="flex justify-between items-start mb-2 p-2 bg-muted rounded-md"
               >
                  <div className="flex items-start space-x-2">
                     <Image
                        src={comment.owner.avatar}
                        alt={comment.owner.username}
                        className="w-6 h-6 rounded-full"
                        width={6}
                        height={6}
                     />
                     <div>
                        <p className="font-semibold text-sm">{comment.owner.username}</p>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                     </div>
                  </div>
               </div>
            ))}
         </ScrollArea>

         <div className="flex gap-2">
            <Input
               placeholder="Add a comment..."
               value={newComment}
               onChange={(e) => setNewComment(e.target.value)}
               className="flex-grow"
               onKeyDown={(e) => e.key === "Enter" && onAddComment()}
            />
            <Button onClick={onAddComment}>Post</Button>
         </div>
      </div>
   );
}
