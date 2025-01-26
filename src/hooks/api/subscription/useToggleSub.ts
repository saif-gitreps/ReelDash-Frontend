import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SubOrUnsubChannelResponse {
   statusCode: number;
   data: {
      _id: string;
      subscriber: string;
      channel: string;
   } | null;
   message: string;
}

const subOrUnsubChannel = async (
   channelId: string
): Promise<SubOrUnsubChannelResponse> => {
   try {
      const response = await apiClient.post(`/api/v1/subscriptions/${channelId}`);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred during watch history fetch"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useSubOrUnsubChannel = () => {
   return useMutation({ mutationFn: subOrUnsubChannel });
};
