import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_HISTORY = 10;

interface SearchHistoryState {
  recentSearches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearAll: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const prev = get().recentSearches.filter((q) => q !== trimmed);
        set({ recentSearches: [trimmed, ...prev].slice(0, MAX_HISTORY) });
      },
      removeSearch: (query: string) => {
        set({ recentSearches: get().recentSearches.filter((q) => q !== query) });
      },
      clearAll: () => set({ recentSearches: [] }),
    }),
    {
      name: 'search-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
