import { CRAFTING_RECIPES, CraftingRecipeId } from '@/constants/CraftingRecipeDefs'
import { CraftingRecipeDef } from '@/constants/CraftingRecipeDefs'

function getRecipeById(recipeId: CraftingRecipeId): CraftingRecipeDef {
  const result = CRAFTING_RECIPES.find(recipe => recipe.id === recipeId);
  if (!result) {
    throw new Error(`Recipe not found for id: ${recipeId}`);
  }

  return result;
}

export const recipeUtil = {
  getRecipeById
}