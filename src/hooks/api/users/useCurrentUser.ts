import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CurrentUserResponse {
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

const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
   try {
      const response = await apiClient.get("/api/v1/users/me");
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.message || "An error occurred during login");
      }
      throw new Error("Network error occurred");
   }
};

export const useCurrentUser = () => {
   return useQuery({ queryKey: ["currentUser"], queryFn: fetchCurrentUser });
};
