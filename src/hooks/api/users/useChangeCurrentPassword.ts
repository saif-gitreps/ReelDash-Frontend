import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface ChangeCurrentPasswordBody {
   oldPassword: string;
   newPassword: string;
}

interface ChangeCurrentPasswordResponse {
   statusCode: number;
   data: null;
   message: string;
}

const changeCurrentPassword = async (
   data: ChangeCurrentPasswordBody
): Promise<ChangeCurrentPasswordResponse> => {
   const response = await apiClient.post("/api/users/change-password", data);
   return response.data;
};

export const useChangeCurrentPassword = () => {
   return useMutation({ mutationFn: changeCurrentPassword });
};
