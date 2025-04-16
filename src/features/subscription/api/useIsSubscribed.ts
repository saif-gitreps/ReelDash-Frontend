import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface IsSubscribedResponse {
   statusCode: number;
   data: boolean;
   message: string;
}

const fetchIsSubscribed = async (channelId: string): Promise<IsSubscribedResponse> => {
   try {
      const { data } = await apiClient.get(
         `/api/v1/subscriptions/is-subscribed/${channelId}`
      );
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message ||
               "An error occurred while checking subscription status"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useIsSubscribed = (
   channelId: string
): UseQueryResult<IsSubscribedResponse, Error> => {
   return useQuery<IsSubscribedResponse, Error>({
      queryKey: ["isSubscribed", channelId],
      queryFn: () => fetchIsSubscribed(channelId),
      enabled: !!channelId, // Ensures the query runs only when a valid `channelId` is provided
   });
};
