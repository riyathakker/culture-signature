import { create } from 'zustand';

interface UIState {
  isAnnouncementVisible: boolean;
  setAnnouncementVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAnnouncementVisible: true,
  setAnnouncementVisible: (visible) => set({ isAnnouncementVisible: visible }),
}));
