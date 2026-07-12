import { apiClient } from '@/lib/api-client';
import type { Recipe } from './types';
import type { Ingredient } from '@/types';

export async function fetchRecipes(ingredients: Ingredient[]) {
  const response = await apiClient.post<Recipe[]>('/recipes/match', {
    ingredients: ingredients.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
    })),
  });

  if (response.code === 0) {
    return response.data;
  } else {
    throw new Error(response.msg);
  }
}

export async function generateRecipeByAI(ingredients: Ingredient[], preferences?: string) {
  const response = await apiClient.post<Recipe[]>('/recipes/generate', {
    ingredients: ingredients.map((item) => item.name),
    preferences,
  });

  if (response.code === 0) {
    return response.data;
  } else {
    throw new Error(response.msg);
  }
}

export async function fetchShoppingList() {
  const response = await apiClient.get<string[]>('/shopping-list');

  if (response.code === 0) {
    return response.data;
  } else {
    throw new Error(response.msg);
  }
}

export async function addToShoppingList(items: string[]) {
  const response = await apiClient.post<{ success: boolean }>('/shopping-list', { items });

  if (response.code === 0) {
    return response.data;
  } else {
    throw new Error(response.msg);
  }
}

export async function removeFromShoppingList(itemId: string) {
  const response = await apiClient.delete<{ success: boolean }>(`/shopping-list/${itemId}`);

  if (response.code === 0) {
    return response.data;
  } else {
    throw new Error(response.msg);
  }
}

export async function shareFridge(inviteeEmail: string) {
  const response = await apiClient.post<{ success: boolean }>('/fridge/share', {
    inviteeEmail,
  });

  if (response.code === 0) {
    return response.data;
  } else {
    throw new Error(response.msg);
  }
}

export async function getSharedMembers() {
  const response = await apiClient.get<{ email: string; role: string }[]>('/fridge/members');

  if (response.code === 0) {
    return response.data;
  } else {
    throw new Error(response.msg);
  }
}
