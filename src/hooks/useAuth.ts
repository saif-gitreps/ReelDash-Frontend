import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
   const user = useAuthStore((state) => state.user);
   const token = useAuthStore((state) => state.token);
   const login = useAuthStore((state) => state.login);
   const logout = useAuthStore((state) => state.logout);
   const updateUser = useAuthStore((state) => state.updateUser);

   return {
      isAuthenticated,
      user,
      token,
      login,
      logout,
      updateUser,
   };
};
