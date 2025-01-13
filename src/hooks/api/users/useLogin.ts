import { useMutation } from "@tanstack/react-query";

interface LoginUserBody {
   email: string;
   password: string;
}

interface LoginUserResponse {
   statusCode: number;
   data: {
      user: {
         id: string;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const loginUser = async (data: LoginUserBody): Promise<LoginUserResponse> => {
   const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error logging in user");
   }

   return response.json();
};

export const useLoginUser = () => {
   return useMutation({ mutationFn: loginUser });
};
