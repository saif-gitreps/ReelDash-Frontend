import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface SubscribedChannel {
   _id: string;
   subscriber: string;
   channel: string;
}

interface GetSubscribedChannelsResponse {
   statusCode: number;
   data: SubscribedChannel[];
   message: string;
}

const fetchSubscribedChannels = async (
   userId: string
): Promise<GetSubscribedChannelsResponse> => {
   const { data } = await apiClient.get(`/api/subscriptions/user/${userId}`);
   return data;
};

export const useGetSubscribedChannels = (userId: string) => {
   return useQuery<GetSubscribedChannelsResponse, Error>({
      queryKey: ["getSubscribedChannels", userId],
      queryFn: () => fetchSubscribedChannels(userId),
      enabled: !!userId, // Ensure the query only runs if userId is provided
   });
};
