import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserChannelProfile {
   _id: string;
   fullname: string;
   username: string;
   subscribersCount: number;
   isSubscribed: boolean;
   avatar: string;
   coverImage?: string;
}

interface UserChannelProfileResponse {
   statusCode: number;
   data: UserChannelProfile;
   message: string;
}

const fetchUserChannelProfile = async (
   username: string
): Promise<UserChannelProfileResponse> => {
   try {
      const { data } = await apiClient.get(`/api/v1/users/channel/${username}`);
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message ||
               "An error occurred while fetching user channel profile"
         );
      }
      throw new Error("Network error occurred");
   }
};

export const useUserChannelProfile = (username: string) => {
   return useQuery<UserChannelProfileResponse, Error>({
      queryKey: ["userChannelProfile", username],
      queryFn: () => fetchUserChannelProfile(username),
      enabled: !!username,
   });
};
