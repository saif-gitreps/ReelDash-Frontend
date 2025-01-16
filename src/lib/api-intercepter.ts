import { refreshAccessToken } from "@/hooks/api/users/useRefreshAccessToken";
import apiClient from "./api-client";

apiClient.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;

         try {
            await refreshAccessToken();
            return apiClient(originalRequest);
         } catch (refreshError) {
            window.location.href = "/login";
            return Promise.reject(refreshError);
         }
      }

      return Promise.reject(error);
   }
);

export default apiClient;
