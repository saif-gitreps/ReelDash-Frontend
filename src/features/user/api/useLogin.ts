import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LoginUserBody {
   email: string;
   password: string;
}

interface LoginUserResponse {
   statusCode: number;
   data: {
      user: {
         _id: string;
         fullname: string;
         username: string;
         email: string;
         avatar: string;
         coverImage?: string;
      };
      accessToken: string;
      refreshToken: string;
   };
   message: string;
}

const loginUser = async (data: LoginUserBody): Promise<LoginUserResponse> => {
   try {
      const response = await apiClient.post("/api/v1/users/login", data);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.message || "An error occurred during login");
      }
      throw new Error("Network error occurred");
   }
};

export const useLoginUser = () => {
   return useMutation({ mutationFn: loginUser });
};
