import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

interface DeleteCommentResponse {
   statusCode: number;
   data: Comment;
   message: string;
}

const deleteComment = async (commentId: string): Promise<DeleteCommentResponse> => {
   try {
      const response = await apiClient.delete(`/api/v1/comments/${commentId}`);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occured while deleting comment"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useDeleteComment = (): UseMutationResult<
   DeleteCommentResponse,
   Error,
   string
> => {
   return useMutation({ mutationFn: deleteComment });
};
