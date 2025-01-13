import { useMutation } from "@tanstack/react-query";

interface RegisterUserBody {
   fullname: string;
   username: string;
   email: string;
   password: string;
   avatar: File;
   coverImage?: File;
}

interface RegisterUserResponse {
   statusCode: number;
   data: {
      id: string;
      fullname: string;
      username: string;
      email: string;
      avatar: string;
      coverImage?: string;
   };
   message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const registerUser = async (data: RegisterUserBody): Promise<RegisterUserResponse> => {
   const formData = new FormData();
   formData.append("fullname", data.fullname);
   formData.append("username", data.username);
   formData.append("email", data.email);
   formData.append("password", data.password);
   formData.append("avatar", data.avatar);
   if (data.coverImage) formData.append("coverImage", data.coverImage);

   const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      body: formData,
   });

   if (!response.ok) {
      throw new Error("Error registering user");
   }

   return response.json();
};

export const useRegisterUser = () => {
   // TODO: Add on success and error toasts.
   return useMutation({
      mutationFn: registerUser,
   });
};
