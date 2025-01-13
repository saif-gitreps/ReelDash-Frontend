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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const updateUserAvatar = async (avatar: File): Promise<UpdateUserAvatarResponse> => {
   const formData = new FormData();
   formData.append("avatar", avatar);

   const response = await fetch(`${API_BASE_URL}/api/users/update-avatar`, {
      method: "POST",
      body: formData,
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error updating avatar");
   }

   return response.json();
};

export const useUpdateUserAvatar = () => {
   return useMutation({ mutationFn: updateUserAvatar });
};
