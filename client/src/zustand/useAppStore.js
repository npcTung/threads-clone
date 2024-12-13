import { create } from "zustand";

const useAppStore = create((set) => ({
  unreadCount: 0,
  sortPost: "Threads",
  isNotication: true,
  isAudio: false,
  isShowSetting: false,
  setSortPost: (sortPost) => set({ sortPost }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setIsNotication: (isNotication) => set({ isNotication: !isNotication }),
  setIsAudio: (isAudio) => set({ isAudio: !isAudio }),
  setIsShowSetting: (isShowSetting) => set({ isShowSetting: !isShowSetting }),
  clearAppData: () =>
    set({
      sortPost: "Threads",
      unreadCount: 0,
      isInfoOpen: false,
      isNotication: true,
      isAudio: false,
      isShowSetting: false,
    }),
}));

export default useAppStore;
