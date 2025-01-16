import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface SubOrUnsubChannelResponse {
   statusCode: number;
   data: {
      _id: string;
      subscriber: string;
      channel: string;
   } | null; // Null if unsubscribed
   message: string;
}

const subOrUnsubChannel = async (
   channelId: string
): Promise<SubOrUnsubChannelResponse> => {
   const response = await apiClient.post(`/api/subscriptions/${channelId}`);
   return response.data;
};

export const useSubOrUnsubChannel = () => {
   return useMutation({ mutationFn: subOrUnsubChannel });
};
