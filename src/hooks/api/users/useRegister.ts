import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
      _id: string;
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

   try {
      const response = await apiClient.post("/api/v1/users/register", formData, {
         headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.message || "An error occurred during login");
      }
      throw new Error("Network error occurred");
   }
};

export const useRegisterUser = () => {
   return useMutation({
      mutationFn: registerUser,
   });
};
