import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as apis from "@/apis";
import { toast } from "sonner";

const useCurrentStore = create(
  persist(
    (set, get) => ({
      currentData: null,
      googleData: null,
      email: null,
      isLoading: false,
      isEditLoading: false,
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setEmail: (email) => set({ email }),
      setCurrentData: (currentData) => set({ currentData }),
      setGoogleData: (googleData) => set({ googleData }),
      clearCurrentData: () =>
        set({
          currentData: null,
          googleData: null,
          email: null,
          isLoggedIn: false,
          isLoading: false,
          isEditLoading: false,
        }),
      getCurrentData: async () => {
        try {
          set({ isLoading: true });
          const response = await apis.getCurrent();
          set({ currentData: response.data });
        } catch (error) {
          set({ currentData: null, isLoggedIn: false });
          console.error(error.response.data.mes);
        } finally {
          set({ isLoading: false });
        }
      },
      bookmark_unbookmark: async (post_id) => {
        try {
          const bookmark = await apis.bookmark_unbookmark(post_id);
          if (bookmark.success) {
            set({ currentData: bookmark.data });
            toast.success(bookmark.mes);
          }
        } catch (error) {
          console.error(error.response.data.mes);
        }
      },
      updateUserProfile: async (data) => {
        try {
          set({ isEditLoading: true });

          const { avatar, ...payload } = data;
          const updatedUser = await apis.updateUserProfile(payload);
          if (updatedUser.success) {
            set({ currentData: updatedUser.data });
            toast.success(updatedUser.mes);
          }
          if (avatar) {
            const formData = new FormData();
            formData.append("avatar", avatar);
            const updatedAvatar = await apis.updateAvatar(formData);
            if (updatedAvatar.success) {
              set({ currentData: updatedAvatar.data });
              toast.success(updatedAvatar.mes);
            }
          }
        } catch (error) {
          console.log(error.response.data.mes);
        } finally {
          set({ isEditLoading: false });
        }
      },
      followUser: async (userId) => {
        try {
          const follow_user = await apis.followUser(userId);
          if (follow_user.success) {
            set({ currentData: follow_user.data });
            toast.success(follow_user.mes);
          }
        } catch (error) {
          console.error(error.response.data.mes);
        }
      },
    }),
    {
      name: "threads-cloned/current",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            (el) => el[0] === "currentData" || el[0] === "isLoggedIn"
          )
        ),
    }
  )
);

export default useCurrentStore;
