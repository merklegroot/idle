import { CraftingRecipe } from '@/models/CraftingRecipe';

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'twine',
    name: 'Twine',
    description: 'A simple cord made from thatch',
    ingredients: [
      { resourceKey: 'thatch', amount: 1 }
    ],
    result: {
      resourceKey: 'twine',
      amount: 1
    }
  },
  {
    id: 'knapped-axe-head',
    name: 'Knapped Axe Head',
    description: 'A chipped stone axe head suitable for hafting',
    ingredients: [
      { resourceKey: 'stone', amount: 1 }
    ],
    result: {
      resourceKey: 'knapped-axe-head',
      amount: 1
    }
  }
];



