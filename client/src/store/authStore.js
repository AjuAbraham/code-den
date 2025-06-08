import { create } from "zustand";
import { persist } from "zustand/middleware";
const authStore = create(
  persist((set) => ({
    authUser: null,
    setUser: (user) => set({ authUser: user }),
  }))
);

export default authStore;
