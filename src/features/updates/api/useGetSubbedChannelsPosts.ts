import apiClient from "@/lib/api-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface Post {
   _id: string;
   content: string;
   owner: string; // User ID of the post owner
   createdAt: string;
   ownerDetails: OwnerDetails;
   updatedAt: string;
}

interface OwnerDetails {
   username: string;
   avatar: string;
}

interface GetSubbedChannelsPostsResponse {
   statusCode: number;
   data: {
      posts: Post[];
      totalPosts: number;
   };
   message: string;
}

interface GetSubbedChannelsPostsParams {
   page?: number;
   limit?: number;
}

const fetchSubbedChannelsPosts = async (
   params: GetSubbedChannelsPostsParams
): Promise<GetSubbedChannelsPostsResponse> => {
   try {
      const response = await apiClient.get("/api/v1/posts", { params });
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message || "An error occured while fetching posts"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useGetSubbedChannelsPosts = (
   params: GetSubbedChannelsPostsParams
): UseQueryResult<GetSubbedChannelsPostsResponse, Error> => {
   return useQuery<GetSubbedChannelsPostsResponse, Error>({
      queryKey: ["subbedChannelsPosts", params],
      queryFn: () => fetchSubbedChannelsPosts(params),
      enabled: !!params.page, // Ensures the query only runs when `page` is provided
   });
};
