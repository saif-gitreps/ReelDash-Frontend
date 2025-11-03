"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAddPost } from "@/features/updates/api/useAddUpdate";
import toast from "react-hot-toast";
import AuthLayer from "@/components/AuthLayer";

const postSchema = z.object({
   content: z
      .string()
      .min(1, "Content is required")
      .max(500, "Content must be less than 500 characters"),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function NewPost() {
   const router = useRouter();
   const { mutate: addPost, isPending } = useAddPost();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<PostFormValues>({
      resolver: zodResolver(postSchema),
      mode: "onSubmit",
   });

   const onSubmit: SubmitHandler<PostFormValues> = (data) => {
      addPost(data, {
         onSuccess: (response) => {
            toast.success(response.message);
            router.push("/updates");
         },
         onError: (error) => {
            toast.error(`Adding update failed. ${error.message}`);
         },
      });
   };

   return (
      <AuthLayer isProtected>
         <div className="container mx-auto p-4 bg-background text-foreground">
            <h1 className="text-2xl font-bold mb-4">Post a new update</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <Label htmlFor="content">Content</Label>

                  <Textarea
                     id="content"
                     {...register("content")}
                     className="bg-secondary text-foreground"
                     rows={4}
                  />
                  {errors.content && (
                     <p className="text-red-500 mt-1">{errors.content.message}</p>
                  )}
               </div>
               <Button
                  type="submit"
                  disabled={isPending}
                  className="yellow-accent-bg w-full"
               >
                  {isPending ? "Posting..." : "Post Update"}
               </Button>
            </form>
         </div>
      </AuthLayer>
   );
}
