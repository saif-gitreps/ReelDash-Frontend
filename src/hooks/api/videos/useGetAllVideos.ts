import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

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
   createdAt: string;
}

interface GetAllVideosResponse {
   statusCode: number;
   data: Video[];
   message: string;
}

interface GetAllVideosParams {
   page?: number;
   limit?: number;
   query?: string;
   sortBy?: string;
   sortType?: number;
   userId?: string;
}

const fetchAllVideos = async (
   params: GetAllVideosParams
): Promise<GetAllVideosResponse> => {
   const { data } = await apiClient.post("/api/videos", params);
   return data;
};

export const useGetAllVideos = (params: GetAllVideosParams) => {
   return useQuery<GetAllVideosResponse, Error>({
      queryKey: ["getAllVideos", params],
      queryFn: () => fetchAllVideos(params),
      enabled: !!params.page,
   });
};
