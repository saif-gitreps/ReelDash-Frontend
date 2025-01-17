import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface PublishVideoBody {
   title: string;
   description: string;
   thumbnail: File;
   video: File;
}

interface PublishVideoResponse {
   statusCode: number;
   data: {
      _id: string;
      videoFile: string;
      thumbnail: string;
      title: string;
      description: string;
      duration: number;
      owner: string;
   };
   message: string;
}

const publishVideo = async (data: PublishVideoBody): Promise<PublishVideoResponse> => {
   const formData = new FormData();
   formData.append("title", data.title);
   formData.append("description", data.description);
   formData.append("thumbnail", data.thumbnail);
   formData.append("video", data.video);

   const response = await apiClient.post("/api/v1/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
   });

   return response.data;
};

export const usePublishAVideo = () => {
   return useMutation({ mutationFn: publishVideo });
};
