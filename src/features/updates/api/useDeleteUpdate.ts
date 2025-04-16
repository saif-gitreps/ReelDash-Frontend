import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

interface Post {
   _id: string;
   content: string;
   owner: string;
   createdAt: string;
   updatedAt: string;
}

interface DeletePostResponse {
   statusCode: number;
   data: Post;
   message: string;
}

const deletePost = async (postId: string): Promise<DeletePostResponse> => {
   try {
      const response = await apiClient.delete(`/api/v1/posts/${postId}`);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while deleting update"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useDeletePost = (): UseMutationResult<DeletePostResponse, Error, string> => {
   return useMutation({ mutationFn: deletePost });
};
