import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateUserCoverImageResponse {
   statusCode: number;
   data: {
      _id: string;
      fullname: string;
      username: string;
      email: string;
      avatar: string;
      coverImage: string;
   };
   message: string;
}

const updateUserCoverImage = async (
   coverImage: File
): Promise<UpdateUserCoverImageResponse> => {
   try {
      const formData = new FormData();
      formData.append("coverImage", coverImage);

      const response = await apiClient.patch("/api/v1/users/cover-image", formData, {
         headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred during cover-image update"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useUpdateUserCoverImage = () => {
   return useMutation({ mutationFn: updateUserCoverImage });
};
