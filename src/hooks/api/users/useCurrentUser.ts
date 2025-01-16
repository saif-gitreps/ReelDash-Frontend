import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

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
   const response = await apiClient.get("/api/users/me");
   return response.data;
};

export const useCurrentUser = () => {
   return useQuery({ queryKey: ["currentUser"], queryFn: fetchCurrentUser });
};
