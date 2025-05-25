import { create } from "zustand";

const globalStore = create((set) => ({
  authUser: null,
  setUser: (user) => set((state) => (state.authUser = user)),
}));

export default globalStore;
