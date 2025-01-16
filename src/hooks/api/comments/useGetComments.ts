import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface CommentOwner {
   _id: string;
   username: string;
   avatar: string;
}

interface VideoComment {
   _id: string;
   content: string;
   owner: CommentOwner;
}

interface GetCommentsResponse {
   statusCode: number;
   data: VideoComment[];
   message: string;
}

const fetchCommentsOnVideo = async (videoId: string): Promise<GetCommentsResponse> => {
   const { data } = await apiClient.get(`/api/videos/${videoId}/comments`);
   return data;
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
