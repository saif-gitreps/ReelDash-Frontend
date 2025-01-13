import { useMutation } from "@tanstack/react-query";

interface LogoutUserResponse {
   statusCode: number;
   data: null;
   message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const logoutUser = async (): Promise<LogoutUserResponse> => {
   const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error logging out user");
   }

   return response.json();
};

export const useLogoutUser = () => {
   return useMutation({ mutationFn: logoutUser });
};
