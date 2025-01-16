import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface LogoutUserResponse {
   statusCode: number;
   data: null;
   message: string;
}

const logoutUser = async (): Promise<LogoutUserResponse> => {
   const response = await apiClient.post("/api/users/logout");
   return response.data;
};

export const useLogoutUser = () => {
   return useMutation({ mutationFn: logoutUser });
};
