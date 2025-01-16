import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface DeleteCommentResponse {
   statusCode: number;
   data: Comment;
   message: string;
}

const deleteComment = async (commentId: string): Promise<DeleteCommentResponse> => {
   const response = await apiClient.delete(`/api/comments/${commentId}`);
   return response.data;
};

export const useDeleteComment = (): UseMutationResult<
   DeleteCommentResponse,
   Error,
   string
> => {
   return useMutation({ mutationFn: deleteComment });
};
