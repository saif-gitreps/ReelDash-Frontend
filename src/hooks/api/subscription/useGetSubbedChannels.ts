import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface SubscribedChannel {
   _id: string;
   username: string;
   avatar: string;
}

interface GetSubscribedChannelResponse {
   statusCode: number;
   data: SubscribedChannel[];
   message: string;
}

const fetchSubscribedChannels = async (): Promise<GetSubscribedChannelResponse> => {
   try {
      const { data } = await apiClient.get(`/api/v1/subscriptions/channels/subscribed`);
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred during watch history fetch"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useGetSubscribedChannels = (): UseQueryResult<
   GetSubscribedChannelResponse,
   Error
> => {
   return useQuery<GetSubscribedChannelResponse, Error>({
      queryKey: ["subscribedChannels"],
      queryFn: fetchSubscribedChannels,
   });
};
