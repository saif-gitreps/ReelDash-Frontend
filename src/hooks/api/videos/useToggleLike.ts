import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LikeUnlikeVideoResponse {
   statusCode: number;
   data: {
      _id?: string;
      likedBy?: string;
      video?: string;
   } | null; // Null if unliked
   message: string;
}

const likeUnlikeVideo = async (videoId: string): Promise<LikeUnlikeVideoResponse> => {
   try {
      const response = await apiClient.post(`/api/v1/likes/toggle/video/${videoId}`);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message ||
               "An error occurred while toggling likes on the video"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useLikeUnlikeVideo = () => {
   return useMutation({ mutationFn: likeUnlikeVideo });
};
