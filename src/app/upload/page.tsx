"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePublishAVideo } from "@/features/videos/api/usePublishAVideo";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthLayer from "@/components/AuthLayer";
import Navbar from "@/components/Navbar";

const videoUploadSchema = z.object({
   title: z.string().min(1, "Title is required").max(100, "Title is too long"),
   description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description is too long"),
   thumbnail: z
      .custom<File>((file) => file instanceof File, "Thumbnail is required")
      .refine((file) => file?.type.startsWith("image/"), "Thumbnail must be an image"),
   video: z
      .custom<File>((file) => file instanceof File, "Video is required")
      .refine((file) => file?.type.startsWith("video/"), "Video must be a video file"),
});

type VideoUploadFormValues = z.infer<typeof videoUploadSchema>;

export default function UploadVideo() {
   const { mutate: publishVideo, isPending } = usePublishAVideo();
   const router = useRouter();

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm<VideoUploadFormValues>({
      resolver: zodResolver(videoUploadSchema),
      mode: "onSubmit",
   });

   const onSubmit: SubmitHandler<VideoUploadFormValues> = (data) => {
      publishVideo(
         {
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            video: data.video,
         },
         {
            onSuccess: (response) => {
               toast.success(response.message);
               router.push("/feed");
            },
            onError: (error) => {
               toast.error(`Login failed. ${error.message}`);
            },
         }
      );
   };

   const handleFileChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      field: "thumbnail" | "video"
   ) => {
      const file = e.target.files?.[0] || null;
      if (file) setValue(field, file);
   };

   return (
      <AuthLayer isProtected>
         <div className="container mx-auto p-4 pb-16">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-red-500">{errors.title.message}</p>}
               </div>

               <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={4} {...register("description")} />
                  {errors.description && (
                     <p className="text-red-500">{errors.description.message}</p>
                  )}
               </div>

               <div>
                  <Label htmlFor="thumbnail">Thumbnail File</Label>
                  <Input
                     id="thumbnail"
                     type="file"
                     accept="image/*"
                     onChange={(e) => handleFileChange(e, "thumbnail")}
                  />
                  {errors.thumbnail && (
                     <p className="text-red-500">{errors.thumbnail.message}</p>
                  )}
               </div>

               <div>
                  <Label htmlFor="video">Video File</Label>
                  <Input
                     id="video"
                     type="file"
                     accept="video/*"
                     onChange={(e) => handleFileChange(e, "video")}
                  />
                  {errors.video && <p className="text-red-500">{errors.video.message}</p>}
               </div>

               <Button type="submit" disabled={isPending}>
                  {isPending ? "Uploading..." : "Upload Video"}
               </Button>
            </form>
         </div>
      </AuthLayer>
   );
}
