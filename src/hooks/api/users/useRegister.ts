import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface RegisterUserBody {
   fullname: string;
   username: string;
   email: string;
   password: string;
   avatar: File;
   coverImage?: File;
}

interface RegisterUserResponse {
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

const registerUser = async (data: RegisterUserBody): Promise<RegisterUserResponse> => {
   const formData = new FormData();
   formData.append("fullname", data.fullname);
   formData.append("username", data.username);
   formData.append("email", data.email);
   formData.append("password", data.password);
   formData.append("avatar", data.avatar);
   if (data.coverImage) formData.append("coverImage", data.coverImage);

   const response = await apiClient.post("/api/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
   });
   return response.data;
};

export const useRegisterUser = () => {
   // TODO: Add on success and error toasts.
   return useMutation({
      mutationFn: registerUser,
   });
};
