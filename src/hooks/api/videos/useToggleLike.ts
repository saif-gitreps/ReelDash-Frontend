import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

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
   const response = await apiClient.post(`/api/videos/${videoId}/like-unlike`);
   return response.data;
};

export const useLikeUnlikeVideo = () => {
   return useMutation({ mutationFn: likeUnlikeVideo });
};
