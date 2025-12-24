import { ResourceId } from "./ResourceDefs";

// while most recipe ids are similar tocraft-{resulting-resource-id}, this is not a guarantee
// don't rely on this being a convention

export type CraftingRecipeId = 
| 'craft-twine' 
| 'craft-knapped-axe-head' 
| 'craft-tool-handle-recipe' 
| 'craft-flimsy-axe-recipe';

export interface CraftingIngredient {
  resourceId: ResourceId;
  quantity: number;
}

export interface CraftingRecipeDef {
  id: string;
  displayName: string;
  ingredients: CraftingIngredient[];
  resultingResourceId: ResourceId;
}

const craftTwineRecipe: CraftingRecipeDef = {
  id: 'craft-twine',
  displayName: 'Twine',
  ingredients: [{ resourceId: 'thatch', quantity: 1 }],
  resultingResourceId: 'twine'
}

const craftKnappedAxeHeadRecipe: CraftingRecipeDef = {
  id: 'craft-knapped-axe-head',
  displayName: 'Knapped Axe Head',
  ingredients: [{ resourceId: 'stone', quantity: 1 }],
  resultingResourceId: 'knapped-axe-head'
}

const craftToolHandleRecipe: CraftingRecipeDef = {
  id: 'craft-tool-handle-recipe',
  displayName: 'Tool Handle',
  ingredients: [{ resourceId: 'stick', quantity: 3 }, { resourceId: 'twine', quantity: 1 }],
  resultingResourceId: 'tool-handle'
}

const craftFlimsyAxeRecipe: CraftingRecipeDef = {
  id: 'craft-flimsy-axe-recipe',
  displayName: 'Flimsy Axe',
  ingredients: [{ resourceId: 'knapped-axe-head', quantity: 1 }, { resourceId: 'tool-handle', quantity: 1 }],
  resultingResourceId: 'flimsy-axe'
}

export const CRAFTING_RECIPES: CraftingRecipeDef[] = [
  craftTwineRecipe,
  craftKnappedAxeHeadRecipe,
  craftToolHandleRecipe,
  craftFlimsyAxeRecipe
];