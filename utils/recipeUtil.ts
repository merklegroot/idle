import { CRAFTING_RECIPES, CraftingRecipeId } from '@/constants/CraftingRecipeDefs'
import { CraftingRecipe } from '@/constants/CraftingRecipeDefs'

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