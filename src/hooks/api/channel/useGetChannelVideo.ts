import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Video } from "../videos/useGetAllVideos";

interface GetChannelVideosResponse {
   statusCode: number;
   data: {
      videos: Video[];
      totalVideos: number; // Add total count
   };
   message: string;
}

interface GetChannelVideosParams {
   page?: number;
   limit?: number;
   sortBy?: string;
   sortType?: number;
   channelId: string;
}

interface GetChannelVideosParams {
   page?: number;
   limit?: number;
   query?: string;
   sortBy?: string;
   sortType?: number;
   userId?: string;
   username?: string; // getting username from the params
}

const fetchChannelVideos = async (
   params: GetChannelVideosParams
): Promise<GetChannelVideosResponse> => {
   const { data } = await apiClient.get(`/api/v1/channels/videos}`, { params });
   return data;
};

export const useGetChannelVideos = (
   params: GetChannelVideosParams
): UseQueryResult<GetChannelVideosResponse, Error> => {
   return useQuery<GetChannelVideosResponse, Error>({
      queryKey: ["channelVideos", params],
      queryFn: () => fetchChannelVideos(params),
   });
};
