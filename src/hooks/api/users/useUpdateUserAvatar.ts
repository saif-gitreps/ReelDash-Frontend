import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface UpdateUserAvatarResponse {
   statusCode: number;
   data: {
      id: string;
      fullname: string;
      username: string;
      email: string;
      avatar: string;
      coverImage?: string;
   };
   message: string;
}

const updateUserAvatar = async (avatar: File): Promise<UpdateUserAvatarResponse> => {
   const formData = new FormData();
   formData.append("avatar", avatar);

   const response = await apiClient.post("/api/users/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
   });
   return response.data;
};

export const useUpdateUserAvatar = () => {
   return useMutation({ mutationFn: updateUserAvatar });
};
