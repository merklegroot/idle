'use client'

import { useMemo, useState } from 'react'
import RecipeDetails from './RecipeDetails'
import RecipeItem from './RecipeItem'
import { CRAFTING_RECIPES } from '@/constants/craftingRecipes'

interface CraftingPanelProps {
  onStartCrafting?: (recipeId: string) => void
}

export default function CraftingPanel({ onStartCrafting }: CraftingPanelProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(
    CRAFTING_RECIPES[0]?.id
  )

  const selectedRecipe = useMemo(() => {
    return CRAFTING_RECIPES.find(r => r.id === selectedRecipeId)
  }, [selectedRecipeId])

  const handleCraft = (recipeId: string) => {
    if (onStartCrafting) {
      onStartCrafting(recipeId)
    }
  }


  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Crafting</h2>
      </div>

      {CRAFTING_RECIPES.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No recipes available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top: recipe list */}
          <div className="border rounded-lg border-gray-200 overflow-hidden">
            <div className="max-h-40 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                {CRAFTING_RECIPES.map(recipe => (
                  <RecipeItem
                    key={recipe.id}
                    recipe={recipe}
                    isSelected={recipe.id === selectedRecipeId}
                    onSelect={setSelectedRecipeId}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: selected recipe details */}
          <div className="border rounded-lg border-gray-200 p-4">
            <RecipeDetails 
              selectedRecipe={selectedRecipe} 
              onCraft={handleCraft}
            />
          </div>
        </div>
      )}
    </div>
  )
}
