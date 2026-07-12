import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ingredient, FreshnessStatus, IngredientCategory } from '@/types';
import { DEFAULT_SHELF_LIFE_BY_CATEGORY } from '@/types';

interface FridgeState {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, data: Partial<Omit<Ingredient, 'id'>>) => void;
  getFreshnessStatus: (ingredient: Ingredient) => FreshnessStatus;
}

const today = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const useFridgeStore = create<FridgeState>()(
  persist(
    (set) => ({
      ingredients: [],

      addIngredient: (data) => {
        const ingredient: Ingredient = {
          ...data,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          ingredients: [...state.ingredients, ingredient],
        }));
      },

      removeIngredient: (id) => {
        set((state) => ({
          ingredients: state.ingredients.filter((item) => item.id !== id),
        }));
      },

      updateIngredient: (id, data) => {
        set((state) => ({
          ingredients: state.ingredients.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        }));
      },

      getFreshnessStatus: (ingredient) => {
        const now = new Date(today());
        const expiry = new Date(ingredient.expiryDate);
        const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) return 'expired';
        if (diffDays <= 2) return 'expiring_soon';
        return 'fresh';
      },
    }),
    {
      name: 'fresh-know-fridge',
    }
  )
);

export function suggestExpiryDate(
  category: IngredientCategory,
  purchaseDate: string
): string {
  const purchase = new Date(purchaseDate);
  const shelfLife = DEFAULT_SHELF_LIFE_BY_CATEGORY[category] ?? 7;
  purchase.setDate(purchase.getDate() + shelfLife);
  return purchase.toISOString().split('T')[0];
}
