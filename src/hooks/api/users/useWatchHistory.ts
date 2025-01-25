import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface VideoOwner {
   username: string;
   avatar: string;
}

interface WatchHistoryItem {
   _id: string;
   title: string;
   description: string;
   thumbnail: string;
   owner: VideoOwner;
}

interface WatchHistoryResponse {
   statusCode: number;
   data: {
      watchHistory: WatchHistoryItem[];
      totalWatchHistoryItems: number;
   };
   message: string;
}

interface WatchHistoryParams {
   page?: number;
   limit?: number;
}

const fetchWatchHistory = async (
   params: WatchHistoryParams
): Promise<WatchHistoryResponse> => {
   try {
      const response = await apiClient.get("/api/v1/users/history", { params });
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

export const useWatchHistory = (params: WatchHistoryParams) => {
   return useQuery<WatchHistoryResponse, Error>({
      queryKey: ["watchHistory", params],
      queryFn: () => fetchWatchHistory(params),
   });
};
