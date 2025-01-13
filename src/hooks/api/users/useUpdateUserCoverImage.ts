import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

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

   const response = await fetch(`${API_BASE_URL}/api/users/update-cover-image`, {
      method: "POST",
      body: formData,
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error updating cover image");
   }

   return response.json();
};

export const useUpdateUserCoverImage = () => {
   return useMutation({ mutationFn: updateUserCoverImage });
};
