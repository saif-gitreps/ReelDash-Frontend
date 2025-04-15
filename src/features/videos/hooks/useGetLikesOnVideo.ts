import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface GetLikesOnVideoResponse {
   statusCode: number;
   data: number;
   message: string;
}

const fetchLikesOnVideo = async (videoId: string): Promise<GetLikesOnVideoResponse> => {
   try {
      const { data } = await apiClient.get(`/api/v1/likes/video/${videoId}`);
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message ||
               "An error occurred while fetching likes on video"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useGetLikesOnAVideo = (
   videoId: string
): UseQueryResult<GetLikesOnVideoResponse, Error> => {
   return useQuery<GetLikesOnVideoResponse, Error>({
      queryKey: ["likesOnVideo", videoId],
      queryFn: () => fetchLikesOnVideo(videoId),
      enabled: !!videoId,
   });
};
