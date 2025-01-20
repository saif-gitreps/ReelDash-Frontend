import apiClient from "@/lib/api-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

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
   try {
      const response = await apiClient.put("/api/v1/users/history", data);
      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.message || "An error occurred during login");
      }
      throw new Error("Network error occurred");
   }
};

export const useUpdateWatchHistory = (): UseMutationResult<
   UpdateWatchHistoryResponse,
   Error,
   UpdateWatchHistoryBody
> => {
   return useMutation({ mutationFn: updateWatchHistory });
};
