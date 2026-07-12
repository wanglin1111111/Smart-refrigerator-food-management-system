export interface ApiResponse<T> {
  code: 0 | string;
  msg: string;
  data: T;
}

export type FreshnessStatus = 'fresh' | 'expiring_soon' | 'expired';

export type IngredientCategory =
  | 'vegetable'
  | 'meat'
  | 'seafood'
  | 'dairy'
  | 'fruit'
  | 'grain'
  | 'condiment'
  | 'frozen'
  | 'beverage'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  note?: string;
}

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  vegetable: '蔬菜',
  meat: '肉类',
  seafood: '海鲜',
  dairy: '乳制品',
  fruit: '水果',
  grain: '主食',
  condiment: '调味品',
  frozen: '冷冻食品',
  beverage: '饮品',
  other: '其他',
};

export const DEFAULT_SHELF_LIFE_BY_CATEGORY: Record<IngredientCategory, number> = {
  vegetable: 5,
  meat: 3,
  seafood: 2,
  dairy: 7,
  fruit: 7,
  grain: 30,
  condiment: 180,
  frozen: 90,
  beverage: 30,
  other: 14,
};
