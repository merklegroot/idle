import { CRAFTING_RECIPES, CraftingRecipeId } from '@/constants/CraftingRecipes'
import { CraftingRecipe } from '@/constants/CraftingRecipes'

function getRecipeById(recipeId: CraftingRecipeId): CraftingRecipe {
  const result = CRAFTING_RECIPES[recipeId];
  if (!result) {
    throw new Error(`Recipe not found for id: ${recipeId}`);
  }

  return {
    id: recipeId,
    ...result
  }
}

export const recipeUtil = {
  getRecipeById
}