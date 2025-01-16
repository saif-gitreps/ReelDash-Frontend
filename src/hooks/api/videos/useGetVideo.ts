import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface VideoOwner {
   _id: string;
   username: string;
   avatar: string;
}

interface VideoCommentOwner {
   _id: string;
   username: string;
   avatar: string;
}

interface VideoComment {
   _id: string;
   content: string;
   owner: VideoCommentOwner;
   createdAt: string;
}

interface Video {
   _id: string;
   title: string;
   description: string;
   videoFile: string;
   thumbnail: string;
   duration: number;
   createdAt: string;
   owner: VideoOwner;
   commentsOnTheVideo: VideoComment[];
   numberOfLikes: number;
}

interface GetVideoResponse {
   statusCode: number;
   data: Video;
   message: string;
}

const fetchVideo = async (videoId: string): Promise<GetVideoResponse> => {
   const { data } = await apiClient.get(`/api/videos/${videoId}`);
   return data;
};

export const useGetVideo = (videoId: string) => {
   return useQuery<GetVideoResponse, Error>({
      queryKey: ["getVideo", videoId],
      queryFn: () => fetchVideo(videoId),
      enabled: !!videoId, // Only fetch when videoId is provided
   });
};
