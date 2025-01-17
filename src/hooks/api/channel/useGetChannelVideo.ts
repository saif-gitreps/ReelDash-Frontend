import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface VideoOwner {
   _id: string;
   username: string;
   avatar: string;
}

interface VideoComment {
   _id: string;
   content: string;
   owner: VideoOwner;
   createdAt: string;
}

interface Video {
   _id: string;
   title: string;
   description: string;
   videoFile: string;
   thumbnail: string;
   createdAt: string;
   likesCount: number;
   commentsCount: number;
   commentsOnTheVideo: VideoComment[];
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
}

const fetchChannelVideos = async (
   params: GetChannelVideosParams
): Promise<GetChannelVideosResponse> => {
   const { data } = await apiClient.get("/api/channels/videos", { params });
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
