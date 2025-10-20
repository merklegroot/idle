export interface CraftingIngredient {
  resourceKey: string;
  amount: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: CraftingIngredient[];
  result: {
    resourceKey: string;
    amount: number;
  };
  unlocked: boolean;
}

export type CraftableResource = 'twine' | 'rope' | 'cloth' | 'leather' | 'knapped-axe-head';

export const CRAFTABLE_RESOURCES: Record<CraftableResource, string> = {
  twine: 'Twine',
  rope: 'Rope',
  cloth: 'Cloth',
  leather: 'Leather',
  'knapped-axe-head': 'Knapped Axe Head'
};

export const CRAFTABLE_RESOURCE_COLORS: Record<CraftableResource, string> = {
  twine: 'text-amber-800',
  rope: 'text-orange-800',
  cloth: 'text-purple-800',
  leather: 'text-brown-800',
  'knapped-axe-head': 'text-gray-700'
};
