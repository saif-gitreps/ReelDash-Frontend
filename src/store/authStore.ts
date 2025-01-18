import { create } from "zustand";

interface User {
   _id: string;
   fullname: string;
   username: string;
   email: string;
   avatar: string;
   coverImage?: string;
}

interface AuthState {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   login: (user: User, token: string) => void;
   logout: () => void;
   updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
   user: null,
   token: null,
   isAuthenticated: false,

   login: (user, token) =>
      set({
         user,
         token,
         isAuthenticated: true,
      }),

   logout: () =>
      set({
         user: null,
         token: null,
         isAuthenticated: false,
      }),

   updateUser: (updatedUser) =>
      set((state) => ({
         user: state.user ? { ...state.user, ...updatedUser } : null,
      })),
}));
