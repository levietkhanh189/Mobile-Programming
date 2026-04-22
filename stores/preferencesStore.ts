import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'vi' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';

interface PreferencesState {
  notifyOrders: boolean;
  notifyPromos: boolean;
  notifyNewProducts: boolean;
  language: Language;
  themeMode: ThemeMode;
  setNotifyOrders: (v: boolean) => void;
  setNotifyPromos: (v: boolean) => void;
  setNotifyNewProducts: (v: boolean) => void;
  setLanguage: (v: Language) => void;
  setThemeMode: (v: ThemeMode) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      notifyOrders: true,
      notifyPromos: true,
      notifyNewProducts: false,
      language: 'vi',
      themeMode: 'system',
      setNotifyOrders: (v) => set({ notifyOrders: v }),
      setNotifyPromos: (v) => set({ notifyPromos: v }),
      setNotifyNewProducts: (v) => set({ notifyNewProducts: v }),
      setLanguage: (v) => set({ language: v }),
      setThemeMode: (v) => set({ themeMode: v }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
