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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const fetchWatchHistory = async (): Promise<WatchHistoryResponse> => {
   const response = await fetch(`${API_BASE_URL}/api/users/watch-history`, {
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error fetching watch history");
   }

   return response.json();
};

export const useWatchHistory = () => {
   return useQuery<WatchHistoryResponse, Error>({
      queryKey: ["watchHistory"],
      queryFn: fetchWatchHistory,
   });
};
