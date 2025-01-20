import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

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

interface Video {
   _id: string;
   videoFile: string;
   thumbnail: string;
   owner: VideoOwner;
   title: string;
   duration: number;
   views: number;
   createdAt: string;
   numberOfLikes: number;
   isLiked: boolean;
   commentsOnTheVideo: VideoComment[];
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
