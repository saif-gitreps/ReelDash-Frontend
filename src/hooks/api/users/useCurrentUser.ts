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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
   const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error fetching current user");
   }

   return response.json();
};

export const useCurrentUser = () => {
   return useQuery({ queryKey: ["currentUser"], queryFn: fetchCurrentUser });
};
