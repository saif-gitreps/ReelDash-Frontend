import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface Post {
   _id: string;
   content: string;
   owner: string; // User ID of the post owner
   createdAt: string;
   updatedAt: string;
}

interface DeletePostResponse {
   statusCode: number;
   data: Post;
   message: string;
}

const deletePost = async (postId: string): Promise<DeletePostResponse> => {
   const response = await apiClient.delete(`/api/posts/${postId}`);
   return response.data;
};

export const useDeletePost = (): UseMutationResult<DeletePostResponse, Error, string> => {
   return useMutation({ mutationFn: deletePost });
};
