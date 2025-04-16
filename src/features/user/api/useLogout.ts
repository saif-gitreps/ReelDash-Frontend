import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface LogoutUserResponse {
   statusCode: number;
   data: null;
   message: string;
}

const logoutUser = async (): Promise<LogoutUserResponse> => {
   try {
      const response = await apiClient.post("/api/v1/users/logout");
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred during logout"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useLogoutUser = () => {
   return useMutation({
      mutationFn: logoutUser,
      onSuccess: () => {
         toast.success("Logged out successfully");
      },
      onError: (error: Error) => {
         toast.error(error.message);
      },
   });
};
