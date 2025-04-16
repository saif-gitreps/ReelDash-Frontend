import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface CommentOwner {
   _id: string;
   username: string;
   avatar: string;
}

export interface Comment {
   _id: string;
   content: string;
   owner: CommentOwner;
   createdAt: string;
   updatedAt: string;
}

interface GetCommentsResponse {
   statusCode: number;
   data: Comment[];
   message: string;
}

const fetchCommentsOnVideo = async (videoId: string): Promise<GetCommentsResponse> => {
   try {
      const { data } = await apiClient.get(`/api/v1/comments/video/${videoId}`);
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occurred while fetching comments"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useGetCommentsOnVideo = (
   videoId: string
): UseQueryResult<GetCommentsResponse, Error> => {
   return useQuery<GetCommentsResponse, Error>({
      queryKey: ["commentsOnVideo", videoId],
      queryFn: () => fetchCommentsOnVideo(videoId),
      enabled: !!videoId,
   });
};
