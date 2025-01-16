import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

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
   const { data } = await apiClient.get("/api/users/watch-history");
   return data;
};

export const useWatchHistory = () => {
   return useQuery<WatchHistoryResponse, Error>({
      queryKey: ["watchHistory"],
      queryFn: fetchWatchHistory,
   });
};
