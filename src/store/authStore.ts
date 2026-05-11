import { create } from "zustand";

type User = {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

type AuthStore = {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false, // Default to false
  user: null,
  login: (user) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
