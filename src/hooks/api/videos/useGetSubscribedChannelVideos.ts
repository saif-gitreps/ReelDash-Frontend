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
   views: number;
   createdAt: string;
}

interface GetSubscribedChannelsVideosResponse {
   statusCode: number;
   data: Video[];
   message: string;
}

interface GetSubscribedChannelsVideosParams {
   page?: number;
   limit?: number;
   query?: string;
   sortBy?: string;
   sortType?: number;
}

const fetchSubscribedChannelsVideos = async (
   params: GetSubscribedChannelsVideosParams
): Promise<GetSubscribedChannelsVideosResponse> => {
   const { data } = await apiClient.get("/api/videos/subscriptions", { params });
   return data;
};

export const useGetSubscribedChannelsVideos = (
   params: GetSubscribedChannelsVideosParams
): UseQueryResult<GetSubscribedChannelsVideosResponse, Error> => {
   return useQuery<GetSubscribedChannelsVideosResponse, Error>({
      queryKey: ["subscribedChannelsVideos", params],
      queryFn: () => fetchSubscribedChannelsVideos(params),
      enabled: !!params.page, // Ensure the query only runs when `page` is provided
   });
};
