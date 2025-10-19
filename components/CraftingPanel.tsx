'use client'

import { useState } from 'react'
import useGameStore from '@/stores/gameStore'
import { getResourceDisplayName, getResourceColorClass } from '@/models/ResourceType'
import type { CraftingRecipe } from '@/models/CraftingRecipe'

interface CraftingPanelProps {
  onClose?: () => void
}

export default function CraftingPanel({ onClose }: CraftingPanelProps) {
  const { getCraftingRecipes, canCraftRecipe, craftRecipe, getResource } = useGameStore()
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)
  
  const recipes = getCraftingRecipes()
  const unlockedRecipes = recipes.filter(recipe => recipe.unlocked)

  const handleCraft = (recipeId: string) => {
    const success = craftRecipe(recipeId)
    if (success) {
      // Show success feedback
      console.log(`Successfully crafted ${recipeId}`)
    } else {
      // Show error feedback
      console.log(`Failed to craft ${recipeId}`)
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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crafting</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      {unlockedRecipes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No recipes available yet.</p>
          <p className="text-sm mt-2">Gather more resources to unlock new recipes!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unlockedRecipes.map((recipe) => {
            const canCraft = canCraftRecipe(recipe.id)
            const isSelected = selectedRecipe === recipe.id
            
            return (
              <div
                key={recipe.id}
                className={`border rounded-lg p-4 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {recipe.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Ingredients:</span>
                        <div className="flex flex-wrap gap-2">
                          {recipe.ingredients.map((ingredient, index) => (
                            <span key={ingredient.resourceKey}>
                              {getIngredientDisplay(ingredient)}
                              {index < recipe.ingredients.length - 1 && <span className="text-gray-400">, </span>}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Result:</span>
                        <span className={`${getResourceColorClass(recipe.result.resourceKey as any)} font-medium`}>
                          {recipe.result.amount} {getResourceDisplayName(recipe.result.resourceKey as any)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedRecipe(isSelected ? null : recipe.id)}
                      className={`px-3 py-1 text-sm rounded ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                    
                    <button
                      onClick={() => handleCraft(recipe.id)}
                      disabled={!canCraft}
                      className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                        canCraft
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Craft
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
