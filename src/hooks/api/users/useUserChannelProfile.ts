import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserChannelProfile {
   fullname: string;
   username: string;
   subscribersCount: number;
   channelsSubscribedToCount: number;
   isSubscribed: boolean;
   avatar: string;
   coverImage?: string;
   email: string;
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
      const { data } = await apiClient.get(`/api/users/channel/${username}`);
      return data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(
            error.response.data.message ||
               "An error occurred during user channel profile fetch"
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
