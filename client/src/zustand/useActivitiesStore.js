import { create } from "zustand";
import * as apis from "@/apis";

const useActivitiesStore = create((set, get) => ({
  activities: [],
  unreadCount: 0,
  nextCursor: null,
  isLoading: false,
  setActivities: (activities) => set({ activities }),
  setunreadCount: (unreadCount) => set({ unreadCount }),
  clearActivities: set({
    activities: [],
    isLoading: false,
    unreadCount: 0,
    nextCursor: null,
  }),
  fetchActivities: async (queries) => {
    try {
      set({ isLoading: true });
      const activities = await apis.getActivities(queries);
      if (activities.success) {
        set({ activities: activities.data });
        set({ nextCursor: activities.nextCursor });
      }
    } catch (error) {
      console.error(error.response.data.mes);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchUnreadCount: async () => {
    try {
      const unreadCount = await apis.unreadCount();
      if (unreadCount.success) set({ unreadCount: unreadCount.unreadCount });
    } catch (error) {
      console.error(error.response.data.mes);
    }
  },
  markAsRead: async () => {
    try {
      const markAsRead = await apis.markAsRead();
      if (markAsRead.success) set({ unreadCount: 0 });
    } catch (error) {
      console.error(error.response.data.mes);
    }
  },
}));

export default useActivitiesStore;
