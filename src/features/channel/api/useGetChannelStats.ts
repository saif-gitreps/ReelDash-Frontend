import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface ChannelStats {
   numberOfSubscribers: number;
   numberOfChannelsSubscribed: number;
   numberOfVideos: number;
   totalViews: number;
   totalLikes: number;
   totalCommunityPosts: number;
}

interface GetChannelStatsResponse {
   statusCode: number;
   data: ChannelStats;
   message: string;
}

const fetchChannelStats = async (): Promise<GetChannelStatsResponse> => {
   const { data } = await apiClient.get("/api/channels/stats");
   return data;
};

export const useGetChannelStats = (): UseQueryResult<GetChannelStatsResponse, Error> => {
   return useQuery<GetChannelStatsResponse, Error>({
      queryKey: ["channelStats"],
      queryFn: fetchChannelStats,
   });
};
