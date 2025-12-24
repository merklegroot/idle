import { ResourceType } from "./resourceDefs";

export interface CraftingIngredient {
  resourceId: ResourceType;
  quantity: number;
}

export interface CraftingResultDef {
  name: string;
  description: string;
  ingredients: CraftingIngredient[];
  result: {
    resourceKey: ResourceType;
    quantity: number;
  };
}

export type CraftingRecipe = {
  id: CraftingRecipeId;
} & CraftingResultDef;

export type CraftingRecipeId = 'craft-twine' | 'craft-knapped-axe-head' | 'craft-tool-handle-recipe' | 'craft-flimsy-axe-recipe';

export const CRAFTING_RECIPES: Record<CraftingRecipeId, CraftingResultDef> = {
  'craft-twine': {
    name: 'Twine',
    description: 'A simple cord made from thatch',
    ingredients: [{ resourceId: 'thatch', quantity: 1 }],
    result: { resourceKey: 'twine', quantity: 1 }
  },
  'craft-knapped-axe-head': {
    name: 'Knapped Axe Head',
    description: 'A chipped stone axe head suitable for hafting',
    ingredients: [{ resourceId: 'stone', quantity: 1 }],
    result: { resourceKey: 'knapped-axe-head', quantity: 1 }
  },
  'craft-tool-handle-recipe': {
    name: 'Tool Handle',
    description: 'A handle for a tool',
    ingredients: [{ resourceId: 'stick', quantity: 3 }, { resourceId: 'twine', quantity: 1 }],
    result: { resourceKey: 'tool-handle', quantity: 1 }
  },
  'craft-flimsy-axe-recipe': {
    name: 'Flimsy Axe',
    description: 'A basic axe for chopping wood',
    ingredients: [{ resourceId: 'knapped-axe-head', quantity: 1 }, { resourceId: 'tool-handle', quantity: 1 }],
    result: { resourceKey: 'flimsy-axe', quantity: 1 }
  }
};