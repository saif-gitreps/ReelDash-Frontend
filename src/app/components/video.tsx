"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Trash2, X, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoProps {
   id: string;
   url: string;
   username: string;
   description: string;
   likes: number;
   comments: number;
}

interface Comment {
   id: string;
   username: string;
   text: string;
}

export default function Video({
   id,
   url,
   username,
   description,
   likes,
   comments: initialComments,
}: VideoProps) {
   const [isLiked, setIsLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(likes);
   const [videoId, setVideoId] = useState("");
   const [comments, setComments] = useState<Comment[]>([]);
   const [newComment, setNewComment] = useState("");
   const [showComments, setShowComments] = useState(false);
   const [isSaved, setIsSaved] = useState(false);

   useEffect(() => {
      // Extract YouTube video ID from URL
      const extractVideoId = (url: string) => {
         const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
         const match = url.match(regExp);
         return match && match[2].length === 11 ? match[2] : null;
      };

      const id = extractVideoId(url);
      if (id) {
         setVideoId(id);
      }

      // Simulate fetching comments
      setComments([
         { id: "1", username: "user1", text: "Great video!" },
         { id: "2", username: "user2", text: "Nice content!" },
         { id: "3", username: "user3", text: "Keep it up!" },
      ]);
   }, [url]);

   const handleLike = () => {
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
   };

   const handleAddComment = () => {
      if (newComment.trim()) {
         const comment: Comment = {
            id: Date.now().toString(),
            username: "currentUser", // Replace with actual logged-in user
            text: newComment.trim(),
         };
         setComments([...comments, comment]);
         setNewComment("");
      }
   };

   const handleDeleteComment = (commentId: string) => {
      setComments(comments.filter((comment) => comment.id !== commentId));
   };

   const handleSave = () => {
      setIsSaved(!isSaved);
      // TODO: Implement actual save functionality
   };

   return (
      <div className="relative w-full h-screen bg-background">
         {videoId ? (
            <iframe
               src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
               className="w-full h-full object-cover"
            />
         ) : (
            <video
               src={url}
               className="w-full h-full object-cover"
               loop
               autoPlay
               muted
               playsInline
            />
         )}
         <div className="absolute bottom-0 left-0 p-4 text-foreground">
            <h2 className="text-lg font-bold">{username}</h2>
            <p>{description}</p>
         </div>
         <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
            <Button
               variant="ghost"
               size="icon"
               onClick={handleLike}
               className="yellow-accent"
            >
               <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <span className="text-foreground">{likeCount}</span>
            <Button
               variant="ghost"
               size="icon"
               onClick={() => setShowComments(true)}
               className="yellow-accent"
            >
               <MessageCircle className="h-6 w-6" />
            </Button>
            <span className="text-foreground">{comments.length}</span>
            <Button variant="ghost" size="icon" className="yellow-accent">
               <Share2 className="h-6 w-6" />
            </Button>
            <Button
               variant="ghost"
               size="icon"
               onClick={handleSave}
               className="yellow-accent"
            >
               <Bookmark className={`h-6 w-6 ${isSaved ? "fill-current" : ""}`} />
            </Button>
         </div>
         {showComments && (
            <div className="absolute bottom-0 left-0 right-0 bg-secondary p-4 h-2/3">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-foreground">Comments</h3>
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setShowComments(false)}
                     className="yellow-accent"
                  >
                     <X className="h-6 w-6" />
                  </Button>
               </div>
               <ScrollArea className="h-[calc(100%-8rem)] mb-4">
                  {comments.map((comment) => (
                     <div
                        key={comment.id}
                        className="flex justify-between items-start mb-2 p-2 bg-muted rounded-md"
                     >
                        <div>
                           <p className="font-semibold text-foreground">
                              {comment.username}
                           </p>
                           <p className="text-muted-foreground">{comment.text}</p>
                        </div>
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => handleDeleteComment(comment.id)}
                           className="yellow-accent"
                        >
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  ))}
               </ScrollArea>
               <div className="flex mt-4">
                  <Input
                     placeholder="Add a comment..."
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     className="flex-grow bg-muted text-foreground"
                  />
                  <Button onClick={handleAddComment} className="ml-2 yellow-accent-bg">
                     Post
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
}
