import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface RefreshAccessTokenBody {
   refreshToken?: string; // Optional, may come from cookies
}

interface RefreshAccessTokenResponse {
   statusCode: number;
   data: {
      accessToken: string;
      newRefreshToken: string;
   };
   message: string;
}

const refreshAccessToken = async (
   body?: RefreshAccessTokenBody
): Promise<RefreshAccessTokenResponse> => {
   const response = await fetch(`${API_BASE_URL}/api/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error refreshing access token");
   }

   return response.json();
};

export const useRefreshAccessToken = () => {
   return useMutation({ mutationFn: refreshAccessToken });
};
