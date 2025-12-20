import { CraftingRecipe } from '@/models/CraftingRecipe';

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'twine',
    name: 'Twine',
    description: 'A simple cord made from thatch',
    ingredients: [
      { resourceKey: 'thatch', quantity: 1 }
    ],
    result: {
      resourceKey: 'twine',
      quantity: 1
    }
  },
  {
    id: 'knapped-axe-head',
    name: 'Knapped Axe Head',
    description: 'A chipped stone axe head suitable for hafting',
    ingredients: [
      { resourceKey: 'stone', quantity: 1 }
    ],
    result: {
      resourceKey: 'knapped-axe-head',
      quantity: 1
    }
  },
  {
    id: 'tool-handle-recipe',
    name: 'Tool Handle',
    description: 'A handle for a tool',
    ingredients: [
      { resourceKey: 'stick', quantity: 3 },
      { resourceKey: 'twine', quantity: 1 }
    ],
    result: {
      resourceKey: 'tool-handle',
      quantity: 1
    }
  },
  {
    id: 'flimsy-axe-recipe',
    name: 'Flimsy Axe',
    description: 'A basic axe for chopping wood',
    ingredients: [
      { resourceKey: 'knapped-axe-head', quantity: 1 },
      { resourceKey: 'tool-handle', quantity: 1 }
    ],
    result: {
      resourceKey: 'flimsy-axe',
      quantity: 1
    }
  }
]; 
