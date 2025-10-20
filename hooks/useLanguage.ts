'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'ru';
  setLanguage: (language: 'en' | 'ru') => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'dope-dough:language',
    }
  )
);
