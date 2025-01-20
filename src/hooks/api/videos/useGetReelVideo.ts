import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface VideoOwner {
   username: string;
   avatar: string;
}

interface VideoCommentOwner {
   username: string;
   avatar: string;
}

interface VideoComment {
   content: string;
   owner: VideoCommentOwner;
   createdAt: string;
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
   numberOfLikes: number;
   commentsOnTheVideo: VideoComment[];
}

interface GetReelVideoResponse {
   statusCode: number;
   data: Video;
   message: string;
}

const fetchReelVideo = async (): Promise<GetReelVideoResponse> => {
   try {
      const { data } = await apiClient.get("/api/v1/videos/reel/random");
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.message || "An error occurred during login");
      }
      throw new Error("Network error occurred");
   }
};

export const useGetReelVideo = (): UseQueryResult<GetReelVideoResponse, Error> => {
   return useQuery<GetReelVideoResponse, Error>({
      queryKey: ["reelVideo"],
      queryFn: fetchReelVideo,
   });
};
