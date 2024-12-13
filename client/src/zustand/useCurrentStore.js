import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCurrentStore = create(
  persist(
    (set) => ({
      currentData: null,
      googleData: null,
      email: null,
      isLoggedIn: false,
      isLoading: false,
      token: null,
      setToken: (token) => set({ token }),
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setEmail: (email) => set({ email }),
      setCurrentData: (currentData) => set({ currentData }),
      setGoogleData: (googleData) => set({ googleData }),
      setIsLoading: (isLoading) => set({ isLoading }),
      clearCurrentData: () =>
        set({
          currentData: null,
          googleData: null,
          email: null,
          isLoggedIn: false,
          isLoading: false,
          token: null,
        }),
    }),
    {
      name: "threads-cloned/current",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            (el) =>
              el[0] === "currentData" ||
              el[0] === "isLoggedIn" ||
              el[0] === "token"
          )
        ),
    }
  )
);

export default useCurrentStore;
