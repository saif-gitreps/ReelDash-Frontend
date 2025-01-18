import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface VideoOwner {
   _id: string;
   username: string;
}

interface Video {
   _id: string;
   videoFile: string;
   thumbnail: string;
   owner: VideoOwner;
   title: string;
   duration: number;
   createdAt: string;
}

interface GetChannelVideosResponse {
   statusCode: number;
   data: Video[];
   message: string;
}

interface GetChannelVideosParams {
   page?: number;
   limit?: number;
   sortBy?: string;
   sortType?: number;
   channelId: string;
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
      enabled: !!params.page,
   });
};
