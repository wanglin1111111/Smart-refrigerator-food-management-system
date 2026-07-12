export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTimeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: string[];
  matchedIngredientIds: string[];
  missingIngredientNames: string[];
  imageUrl?: string;
}

export interface RecipeMatchResult {
  recipes: Recipe[];
  fridgeIngredientIds: string[];
}
