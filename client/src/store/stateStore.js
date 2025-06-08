import { create } from "zustand";
import { persist } from "zustand/middleware";

const stateStore = create(
  persist((set) => ({
    acceptedPrevSubmissionCode: "",
    acceptedPrevSubmissionLanguage: "",
    tags:[],
    setSubmissionCode: (code) => set({ acceptedPrevSubmissionCode: code }),
    setTags: (tags) => set({ tags: tags }),
    setSubmissionLanguage: (language) =>
      set({ acceptedPrevSubmissionLanguage: language }),
  }))
);

export default stateStore;
