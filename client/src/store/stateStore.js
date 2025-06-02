import { create } from "zustand";
import { persist } from "zustand/middleware";

const stateStore = create(
  persist((set) => ({
    tags: [],
    companies: [],
    setTags: (tags) => set({ tags }),
    setCompanies: (companies) => set({ companies }),
  }))
);

export default stateStore;
