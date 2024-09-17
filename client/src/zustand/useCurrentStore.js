import { create } from "zustand";

const useCurrentStore = create((set, get) => ({
  currentData: null,
  setCurrentData: (currentData) => set({ currentData }),
  clearCurrentData: () => set({ currentData: null }),
}));

export default useCurrentStore;
