'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeGetItem, safeSetItem, isValidLanguage } from '@/lib/security';

interface LanguageState {
  language: 'en' | 'ru';
  setLanguage: (language: 'en' | 'ru') => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => {
        // Validate language before setting
        if (isValidLanguage(language)) {
          set({ language });
        } else {
          console.error('[Security] Invalid language value:', language);
        }
      },
    }),
    {
      name: 'dope-dough:language',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const item = safeGetItem(name, isValidLanguage);
          return item ? JSON.stringify({ state: { language: item } }) : null;
        },
        setItem: (name, value) => {
          try {
            const parsed = JSON.parse(value);
            const language = parsed?.state?.language;
            if (isValidLanguage(language)) {
              safeSetItem(name, language);
            }
          } catch (error) {
            console.error('[Security] Failed to save language:', error);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error('[Security] Failed to remove language:', error);
          }
        }
      }))
    }
  )
);
