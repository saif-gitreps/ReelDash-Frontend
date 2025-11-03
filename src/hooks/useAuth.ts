import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
   const user = useAuthStore((state) => state.user);
   const login = useAuthStore((state) => state.login);
   const logout = useAuthStore((state) => state.logout);
   const updateUser = useAuthStore((state) => state.updateUser);

   return {
      isAuthenticated,
      user,
      login,
      logout,
      updateUser,
   };
};
