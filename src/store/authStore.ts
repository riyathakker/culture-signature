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
  isModalOpen: boolean;
  callbackUrl: string | null;
  login: (user: User) => void;
  logout: () => void;
  openModal: (callbackUrl?: string) => void;
  closeModal: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,
  isModalOpen: false,
  callbackUrl: null,
  login: (user) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
  openModal: (callbackUrl) => set({ isModalOpen: true, callbackUrl: callbackUrl ?? null }),
  closeModal: () => set({ isModalOpen: false, callbackUrl: null }),
}));
