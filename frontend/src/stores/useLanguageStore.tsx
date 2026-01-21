import { create } from "zustand";
import { languages } from "../languages";
import type { LanguageStore } from "../types/languagesStore";

export const useLanguageStore = create<LanguageStore>((set) => ({
  lang: "vi",
  t: languages["vi"],

  setLang: (newLang) =>
  set((state) => {
    if (state.lang === newLang) return state; // không đổi gì nếu giống nhau
    return { lang: newLang, t: languages[newLang] };
  }),

}));
