import { create } from "zustand";
import { persist } from "zustand/middleware";

const stateStore = create(
  persist((set) => ({
    acceptedPrevSubmissionCode: "",
    acceptedPrevSubmissionLanguage: "",
    setSubmissionCode: (code) => set({ acceptedPrevSubmissionCode: code }),
    setSubmissionLanguage: (language) =>
      set({ acceptedPrevSubmissionLanguage: language }),
  }))
);

export default stateStore;
