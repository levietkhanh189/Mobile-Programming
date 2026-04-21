import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  addFavorite: (product: FavoriteItem) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      isFavorite: (id) => get().items.some(i => i.id === id),
      addFavorite: (product) => set(s => ({
        items: s.items.some(i => i.id === product.id) ? s.items : [...s.items, product],
      })),
      removeFavorite: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
