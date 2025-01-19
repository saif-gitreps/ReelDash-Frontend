import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface VideoOwner {
   _id: string;
   username: string;
}

interface Video {
   _id: string;
   videoFile: string;
   thumbnail: string;
   owner: VideoOwner;
   title: string;
   duration: number;
   views: number;
   createdAt: string;
}

interface GetSubscribedChannelsVideosResponse {
   statusCode: number;
   data: {
      videos: Video[];
      totalVideos: number;
   };
   message: string;
}

interface GetSubscribedChannelsVideosParams {
   page?: number;
   limit?: number;
   query?: string;
   sortBy?: string;
   sortType?: number;
}

const fetchSubscribedChannelsVideos = async (
   params: GetSubscribedChannelsVideosParams
): Promise<GetSubscribedChannelsVideosResponse> => {
   try {
      const response = await apiClient.get("/api/v1/videos/subscriptions", { params });
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while fetching videos"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useGetSubscribedChannelsVideos = (
   params: GetSubscribedChannelsVideosParams
): UseQueryResult<GetSubscribedChannelsVideosResponse, Error> => {
   return useQuery<GetSubscribedChannelsVideosResponse, Error>({
      queryKey: ["subscribedChannelsVideos", params],
      queryFn: () => fetchSubscribedChannelsVideos(params),
      enabled: !!params.page, // Ensure the query only runs when `page` is provided
   });
};
