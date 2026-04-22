import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../services/api';

export interface CartItem extends Product {
    quantity: number;
    selected: boolean;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, qty?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    toggleSelected: (productId: number) => void;
    setAllSelected: (value: boolean) => void;
    selectedItems: () => CartItem[];
    selectedTotal: () => number;
    selectedCount: () => number;
    removeSelected: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, qty = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: qty, selected: true }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },
            toggleSelected: (productId) => {
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, selected: !item.selected } : item
                    ),
                });
            },
            setAllSelected: (value) => {
                set({ items: get().items.map((item) => ({ ...item, selected: value })) });
            },
            selectedItems: () => get().items.filter((item) => item.selected),
            selectedTotal: () =>
                get().items
                    .filter((item) => item.selected)
                    .reduce((sum, item) => sum + item.price * item.quantity, 0),
            selectedCount: () => get().items.filter((item) => item.selected).length,
            removeSelected: () => {
                set({ items: get().items.filter((item) => !item.selected) });
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Backwards-compat: items without `selected` default to true on rehydration
            merge: (persistedState: unknown, currentState: CartState): CartState => {
                const persisted = persistedState as Partial<CartState> & { items?: CartItem[] };
                const migratedItems = (persisted.items ?? []).map((item) => ({
                    ...item,
                    selected: item.selected !== undefined ? item.selected : true,
                }));
                return { ...currentState, ...persisted, items: migratedItems };
            },
        }
    )
);
