import { create } from "zustand";
const authStore = create((set) => ({
  authUser: null,
  setUser: (user) => set({ authUser: user }),
}));

export default authStore;
