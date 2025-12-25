'use client'

import { CraftingRecipeDef, CraftingRecipeId } from '@/constants/CraftingRecipeDefs'
import { resourceUtil } from '@/utils/resourceUtil'

interface RecipeItemProps {
  recipe: CraftingRecipeDef
  isSelected: boolean 
  onSelect: (recipeId: CraftingRecipeId) => void
}

export default function RecipeItem({ recipe, isSelected, onSelect }: RecipeItemProps) {
  const recipeIcon = resourceUtil.getRecipeIcon(recipe);

  return (
    <button
      key={recipe.id}
      onClick={() => onSelect(recipe.id)}
      className={`w-full text-center px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-gray-100' : ''
      }`}
    >
      <div className="flex flex-col items-center gap-1">
        <div className="text-lg">{recipeIcon}</div>
        <div className="text-xs font-medium text-gray-800">{recipe.displayName}</div>
      </div>
    </button>
  );
}
