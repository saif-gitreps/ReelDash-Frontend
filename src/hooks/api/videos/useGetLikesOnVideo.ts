import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface GetLikesOnVideoResponse {
   statusCode: number;
   data: number;
   message: string;
}

const fetchLikesOnVideo = async (videoId: string): Promise<GetLikesOnVideoResponse> => {
   const { data } = await apiClient.get(`/api/v1/likes/video/${videoId}`);
   return data;
};

export const useGetLikesOnAVideo = (
   videoId: string
): UseQueryResult<GetLikesOnVideoResponse, Error> => {
   return useQuery<GetLikesOnVideoResponse, Error>({
      queryKey: ["likesOnVideo", videoId],
      queryFn: () => fetchLikesOnVideo(videoId),
      enabled: !!videoId, // Ensures the query only runs when `videoId` is provided
   });
};
