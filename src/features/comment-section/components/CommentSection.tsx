import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateCommentOnVideo } from "@/features/comment-section/api/useCreateComment";
import { useDeleteComment } from "@/features/comment-section/api/useDeleteComment";
import { Comment } from "@/features/comment-section/api/useGetComments";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

interface CommentsSectionProps {
   comments: Comment[];
   onClose: () => void;
   videoId: string;
}

export function CommentsSection({ comments, videoId, onClose }: CommentsSectionProps) {
   const [newComment, setNewComment] = useState("");
   const queryClient = useQueryClient();
   const { isAuthenticated, user } = useAuth();
   const { mutate: addComment, isPending: isAddCommentPending } =
      useCreateCommentOnVideo();
   const { mutate: deleteComment, isPending: isDeleteCommentPending } =
      useDeleteComment();

   const handleAddComment = () => {
      const trimmedComment = newComment.trim();
      if (!trimmedComment) return;

      addComment(
         {
            videoId,
            data: { content: trimmedComment },
         },
         {
            onSuccess: () => {
               queryClient.invalidateQueries({
                  queryKey: ["commentsOnVideo", videoId],
               });
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
            queryClient.invalidateQueries({
               queryKey: ["commentsOnVideo", videoId],
            });
            toast.success("Comment deleted successfully");
         },
         onError: (error) => {
            toast.error(`Error deleting comment: ${error.message}`);
         },
      });
   };

   return (
      <div className="absolute bottom-0 z-40 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 h-2/3 rounded-t-xl">
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
                        <p className="text-base text-muted-foreground">
                           {comment.content}
                        </p>
                     </div>
                  </div>

                  {isAuthenticated && comment.owner.username === user?.username && (
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment._id)}
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
            <Input
               placeholder={
                  isAuthenticated ? "Add a comment..." : "Login to add a comment"
               }
               value={newComment}
               disabled={!isAuthenticated}
               onChange={(e) => setNewComment(e.target.value)}
               className={`flex-grow ${!isAuthenticated && "text-center"}`}
               onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isAddCommentPending) {
                     e.preventDefault();
                     handleAddComment();
                  }
               }}
            />
            {isAuthenticated && (
               <Button
                  onClick={handleAddComment}
                  disabled={isAddCommentPending || !newComment.trim()}
               >
                  Post
               </Button>
            )}
         </div>
      </div>
   );
}
