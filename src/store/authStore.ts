import { create } from "zustand";

export interface User {
   _id: string;
   fullname: string;
   username: string;
   email: string;
   avatar: string;
   coverImage?: string;
}

interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   login: (user: User) => void;
   logout: () => void;
   updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
   user: null,
   isAuthenticated: false,

   login: (user) =>
      set({
         user,
         isAuthenticated: true,
      }),

   logout: () =>
      set({
         user: null,
         isAuthenticated: false,
      }),

   updateUser: (updatedUser) =>
      set((state) => ({
         user: state.user ? { ...state.user, ...updatedUser } : null,
      })),
}));
