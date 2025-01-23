import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

interface CreateCommentBody {
   content: string;
}

interface Comment {
   _id: string;
   content: string;
   video: string;
   owner: string;
   createdAt: string;
   updatedAt: string;
}

interface CreateCommentResponse {
   statusCode: number;
   data: Comment;
   message: string;
}

const createCommentOnVideo = async (
   videoId: string,
   data: CreateCommentBody
): Promise<CreateCommentResponse> => {
   try {
      const response = await apiClient.post(`/api/v1/comments/video/${videoId}`, data);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while adding comment"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useCreateCommentOnVideo = (): UseMutationResult<
   CreateCommentResponse,
   Error,
   { videoId: string; data: CreateCommentBody }
> => {
   return useMutation({
      mutationFn: ({ videoId, data }) => createCommentOnVideo(videoId, data),
   });
};
