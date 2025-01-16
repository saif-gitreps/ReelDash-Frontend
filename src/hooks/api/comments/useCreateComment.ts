import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

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
   const response = await apiClient.post(`/api/videos/${videoId}/comments`, data);
   return response.data;
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
