import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

interface AddPostBody {
   content: string;
}

interface Post {
   _id: string;
   content: string;
   owner: string;
   createdAt: string;
   updatedAt: string;
}

interface AddPostResponse {
   statusCode: number;
   data: Post;
   message: string;
}

const addPost = async (data: AddPostBody): Promise<AddPostResponse> => {
   try {
      const response = await apiClient.post("/api/v1/posts", data);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while posting the update"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useAddPost = (): UseMutationResult<AddPostResponse, Error, AddPostBody> => {
   return useMutation({ mutationFn: addPost });
};
