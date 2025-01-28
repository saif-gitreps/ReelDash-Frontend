import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface IsLikedResponse {
   statusCode: number;
   data: boolean;
   message: string;
}

const fetchIsLiked = async (videoId: string): Promise<IsLikedResponse> => {
   try {
      const { data } = await apiClient.get(`/api/v1/likes/isLiked/video/${videoId}`);
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while checking like status"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useIsLiked = (videoId: string): UseQueryResult<IsLikedResponse, Error> => {
   return useQuery<IsLikedResponse, Error>({
      queryKey: ["isLiked", videoId],
      queryFn: () => fetchIsLiked(videoId),
      enabled: !!videoId,
   });
};
