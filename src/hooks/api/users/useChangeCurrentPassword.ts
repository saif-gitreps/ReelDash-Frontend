import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

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
   const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error changing password");
   }

   return response.json();
};

export const useChangeCurrentPassword = () => {
   return useMutation({ mutationFn: changeCurrentPassword });
};
