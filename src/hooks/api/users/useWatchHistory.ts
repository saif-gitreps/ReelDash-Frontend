import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface VideoOwner {
   username: string;
   fullname: string;
   avatar: string;
}

interface WatchHistoryItem {
   _id: string;
   title: string;
   description: string;
   owner: VideoOwner;
}

interface WatchHistoryResponse {
   statusCode: number;
   data: WatchHistoryItem[];
   message: string;
}

const fetchWatchHistory = async (): Promise<WatchHistoryResponse> => {
   try {
      const response = await apiClient.get("/api/v1/users/history");
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

export const useWatchHistory = () => {
   return useQuery<WatchHistoryResponse, Error>({
      queryKey: ["watchHistory"],
      queryFn: fetchWatchHistory,
   });
};
