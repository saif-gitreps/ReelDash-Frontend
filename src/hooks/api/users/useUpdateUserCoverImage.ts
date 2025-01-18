import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateUserCoverImageResponse {
   statusCode: number;
   data: {
      id: string;
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

      const response = await apiClient.post("/api/users/update-cover-image", formData, {
         headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred during cover image update"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useUpdateUserCoverImage = () => {
   return useMutation({ mutationFn: updateUserCoverImage });
};
