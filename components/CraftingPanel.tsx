'use client'

import { useEffect, useMemo, useState } from 'react'
import useGameStore from '@/stores/gameStore'
import { getResourceDisplayName, getResourceColorClass } from '@/models/ResourceType'

interface CraftingPanelProps {
  onClose?: () => void
  onStartCrafting?: (recipeId: string) => void
}

export default function CraftingPanel({ onClose, onStartCrafting }: CraftingPanelProps) {
  const { getCraftingRecipes, canCraftRecipe, getResource } = useGameStore()
  
  const recipes = getCraftingRecipes()
  const unlockedRecipes = recipes.filter(recipe => recipe.unlocked)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(
    unlockedRecipes[0]?.id
  )

  // Keep selection in sync with unlocked list changes
  useEffect(() => {
    if (!unlockedRecipes.length) {
      setSelectedRecipeId(undefined)
      return
    }
    // If current selection is no longer present, select first
    const stillExists = unlockedRecipes.some(r => r.id === selectedRecipeId)
    if (!stillExists) {
      setSelectedRecipeId(unlockedRecipes[0].id)
    }
  }, [unlockedRecipes, selectedRecipeId])

  const selectedRecipe = useMemo(() => {
    return unlockedRecipes.find(r => r.id === selectedRecipeId)
  }, [unlockedRecipes, selectedRecipeId])

  const handleCraft = (recipeId: string) => {
    if (!canCraftRecipe(recipeId)) {
      return
    }
    
    if (onStartCrafting) {
      onStartCrafting(recipeId)
    }
  }

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Crafting</h2>
      </div>

      {unlockedRecipes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No recipes available yet.</p>
          <p className="text-sm mt-2">Gather more resources to unlock new recipes!</p>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Left: recipe list */}
          <div className="w-1/3 border rounded-lg border-gray-200 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {unlockedRecipes.map(recipe => {
                const isSelected = recipe.id === selectedRecipeId
                const canCraft = canCraftRecipe(recipe.id)
                return (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={`w-full text-left px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{recipe.name}</div>
                        {recipe.description && (
                          <div className="text-xs text-gray-500 line-clamp-2">{recipe.description}</div>
                        )}
                      </div>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${
                        canCraft ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {canCraft ? 'Ready' : 'Need mats'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: selected recipe details */}
          <div className="flex-1 border rounded-lg border-gray-200 p-4">
            {!selectedRecipe ? (
              <div className="text-center text-gray-500 py-12">Select a recipe to view details</div>
            ) : (
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
                        onClick={() => handleCraft(selectedRecipe.id)}
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
            )}
          </div>
        </div>
      )}
    </div>
  )
}
