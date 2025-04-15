import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

   try {
      const response = await apiClient.post("/api/v1/videos", formData, {
         headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while publishing the video"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const usePublishAVideo = () => {
   return useMutation({ mutationFn: publishVideo });
};
