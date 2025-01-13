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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const fetchUserChannelProfile = async (
   username: string
): Promise<UserChannelProfileResponse> => {
   const response = await fetch(`${API_BASE_URL}/api/users/channel/${username}`, {
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error fetching user channel profile");
   }

   return response.json();
};

export const useUserChannelProfile = (username: string) => {
   return useQuery<UserChannelProfileResponse, Error>({
      queryKey: ["userChannelProfile", username],
      queryFn: () => fetchUserChannelProfile(username),
      enabled: !!username,
   });
};
