import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateUserAvatarResponse {
   statusCode: number;
   data: {
      _id: string;
      fullname: string;
      username: string;
      email: string;
      avatar: string;
      coverImage?: string;
   };
   message: string;
}

const updateUserAvatar = async (avatar: File): Promise<UpdateUserAvatarResponse> => {
   try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await apiClient.post("/api/users/update-avatar", formData, {
         headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred during avatar update"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useUpdateUserAvatar = () => {
   return useMutation({ mutationFn: updateUserAvatar });
};
