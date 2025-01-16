import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

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
   const formData = new FormData();
   formData.append("coverImage", coverImage);

   const response = await apiClient.post("/api/users/update-cover-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
   });
   return response.data;
};

export const useUpdateUserCoverImage = () => {
   return useMutation({ mutationFn: updateUserCoverImage });
};
