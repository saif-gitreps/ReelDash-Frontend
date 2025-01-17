import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
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
   createdAt: string;
}

interface GetAllVideosResponse {
   statusCode: number;
   data: Video[];
   message: string;
}

interface GetAllVideosBody {
   page?: number;
   limit?: number;
   query?: string;
   sortBy?: string;
   sortType?: number;
   userId?: string;
}

const fetchAllVideos = async (data: GetAllVideosBody): Promise<GetAllVideosResponse> => {
   try {
      const response = await apiClient.get("/api/v1/videos", { params: data });
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.message || "An error occurred during login");
      }
      throw new Error("Network error occurred");
   }
};

export const useGetAllVideos = (params: GetAllVideosBody) => {
   return useQuery<GetAllVideosResponse, Error>({
      queryKey: ["getAllVideos", params],
      queryFn: () => fetchAllVideos(params),
      enabled: !!params.page,
   });
};
