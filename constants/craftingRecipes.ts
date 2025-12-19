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
  }
];



