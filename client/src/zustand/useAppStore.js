import { create } from "zustand";

const useAppStore = create((set) => ({
  unreadCount: 0,
  sortPost: "Threads",
  isInfoOpen: false,
  isNotication: true,
  isAudio: false,
  setSortPost: (sortPost) => set({ sortPost }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setIsInfoOpen: (isInfoOpen) => set({ isInfoOpen: !isInfoOpen }),
  setIsNotication: (isNotication) => set({ isNotication: !isNotication }),
  setIsAudio: (isAudio) => set({ isAudio: !isAudio }),
  clearAppData: () =>
    set({
      sortPost: "Threads",
      unreadCount: 0,
      isInfoOpen: false,
      isNotication: true,
      isAudio: false,
    }),
}));

export default useAppStore;
