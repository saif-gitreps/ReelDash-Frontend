import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface VideoOwner {
   username: string;
   avatar: string;
}

export interface Video {
   _id: string;
   videoFile: string;
   thumbnail: string;
   owner: VideoOwner;
   title: string;
   duration: number;
   views: number;
   createdAt: string;
}

interface GetVideoResponse {
   statusCode: number;
   data: Video;
   message: string;
}

const fetchVideo = async (videoId: string): Promise<GetVideoResponse> => {
   try {
      const { data } = await apiClient.get(`/api/v1/videos/${videoId}`);
      console.log(data);
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while fetching video"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useGetVideo = (videoId: string) => {
   return useQuery<GetVideoResponse, Error>({
      queryKey: ["getVideo", videoId],
      queryFn: () => fetchVideo(videoId),
      enabled: !!videoId, // Only fetch when videoId is provided
   });
};
