'use client'

import useGameStore from '@/stores/gameStore'
import { getResourceColorClass } from '@/models/ResourceType';
import { CraftingRecipe } from '@/constants/CraftingRecipes'
import { resourceUtil } from '@/utils/resourceUtil'
import { CraftingIngredient } from '@/constants/CraftingRecipes'

interface RecipeDetailsProps {
  selectedRecipe: CraftingRecipe | null | undefined
  onCraft: (recipeId: string) => void
}

export default function RecipeDetails({ selectedRecipe, onCraft }: RecipeDetailsProps) {
  const { canCraftRecipe, getResource } = useGameStore()

  const getIngredientDisplay = (ingredient: CraftingIngredient) => {
    const resource = getResource(ingredient.resourceId)
    const hasEnough = resource && resource.quantity >= ingredient.quantity
    const colorClass = hasEnough ? getResourceColorClass(ingredient.resourceId as any) : 'text-red-600'
    
    const ingredientIcon = resourceUtil.getIngredientIcon(ingredient);

    return (
      <span key={ingredient.resourceId} className={colorClass}>
        {ingredientIcon} {ingredient.quantity} {resourceUtil.getResourceDisplayName(ingredient.resourceId as any)}
        {resource && ` (${resource.quantity})`}
      </span>
    );
  }

  if (!selectedRecipe) {
    return (
      <div className="text-center text-gray-500 py-12">Select a recipe to view details</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{resourceUtil.getRecipeIcon(selectedRecipe)} {selectedRecipe.name}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium text-gray-700 mt-0.5">Ingredients:</span>
          <div className="flex flex-wrap gap-2">
            {selectedRecipe.ingredients.map((ingredient: CraftingIngredient, index: number) => (
              <span key={ingredient.resourceId}>
                {getIngredientDisplay(ingredient)}
                {index < selectedRecipe.ingredients.length - 1 && <span className="text-gray-400">, </span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {(() => {
          const canCraft = canCraftRecipe(selectedRecipe.id)
          return (
            <button
              onClick={() => onCraft(selectedRecipe.id)}
              disabled={!canCraft}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                canCraft
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Craft
            </button>
          )
        })()}
      </div>
    </div>
  )
}
