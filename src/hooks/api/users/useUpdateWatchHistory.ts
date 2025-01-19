import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface UpdateWatchHistoryBody {
   videos: string[]; // Array of video IDs to add to the watch history
}

interface UpdateWatchHistoryResponse {
   statusCode: number;
   data: null;
   message: string;
}

const updateWatchHistory = async (
   data: UpdateWatchHistoryBody
): Promise<UpdateWatchHistoryResponse> => {
   const response = await apiClient.post("/api/users/watch-history", data);
   return response.data;
};

export const useUpdateWatchHistory = (): UseMutationResult<
   UpdateWatchHistoryResponse,
   Error,
   UpdateWatchHistoryBody
> => {
   return useMutation({ mutationFn: updateWatchHistory });
};
