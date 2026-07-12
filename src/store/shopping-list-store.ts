import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShoppingListItem {
  id: string;
  name: string;
  checked: boolean;
}

interface ShoppingListState {
  items: ShoppingListItem[];
  addItem: (name: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearCompleted: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        set((state) => {
          if (state.items.some((item) => item.name === trimmedName)) {
            return state;
          }
          return {
            items: [...state.items, { id: crypto.randomUUID(), name: trimmedName, checked: false }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.checked),
        }));
      },
    }),
    {
      name: 'fresh-know-shopping-list',
    }
  )
);
