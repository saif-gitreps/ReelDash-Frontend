import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

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
   const { data } = await apiClient.get(`/api/users/channel/${username}`);
   return data;
};

export const useUserChannelProfile = (username: string) => {
   return useQuery<UserChannelProfileResponse, Error>({
      queryKey: ["userChannelProfile", username],
      queryFn: () => fetchUserChannelProfile(username),
      enabled: !!username,
   });
};
