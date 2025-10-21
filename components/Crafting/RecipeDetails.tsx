'use client'

import { useMemo } from 'react'
import useGameStore from '@/stores/gameStore'
import { getResourceDisplayName, getResourceColorClass } from '@/models/ResourceType'

interface RecipeDetailsProps {
  selectedRecipe: any
  onCraft: (recipeId: string) => void
}

export default function RecipeDetails({ selectedRecipe, onCraft }: RecipeDetailsProps) {
  const { canCraftRecipe, getResource } = useGameStore()

  const getIngredientDisplay = (ingredient: { resourceKey: string; amount: number }) => {
    const resource = getResource(ingredient.resourceKey)
    const hasEnough = resource && resource.amount >= ingredient.amount
    const colorClass = hasEnough ? getResourceColorClass(ingredient.resourceKey as any) : 'text-red-600'
    
    return (
      <span key={ingredient.resourceKey} className={colorClass}>
        {ingredient.amount} {getResourceDisplayName(ingredient.resourceKey as any)}
        {resource && ` (${resource.amount})`}
      </span>
    )
  }

  if (!selectedRecipe) {
    return (
      <div className="text-center text-gray-500 py-12">Select a recipe to view details</div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{selectedRecipe.name}</h3>
        {selectedRecipe.description && (
          <p className="text-sm text-gray-600 mt-1">{selectedRecipe.description}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium text-gray-700 mt-0.5">Ingredients:</span>
          <div className="flex flex-wrap gap-2">
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <span key={ingredient.resourceKey}>
                {getIngredientDisplay(ingredient)}
                {index < selectedRecipe.ingredients.length - 1 && <span className="text-gray-400">, </span>}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Result:</span>
          <span className={`${getResourceColorClass(selectedRecipe.result.resourceKey as any)} font-medium`}>
            {selectedRecipe.result.amount} {getResourceDisplayName(selectedRecipe.result.resourceKey as any)}
          </span>
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
