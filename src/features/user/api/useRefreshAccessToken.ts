import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

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

export const refreshAccessToken = async (
   body?: RefreshAccessTokenBody
): Promise<RefreshAccessTokenResponse> => {
   const response = await apiClient.post("/api/users/refresh-token", body || {});
   return response.data;
};

export const useRefreshAccessToken = () => {
   return useMutation({ mutationFn: refreshAccessToken });
};
