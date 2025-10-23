'use client'

import useGameStore from '@/stores/gameStore'

interface RecipeItemProps {
  recipe: any
  isSelected: boolean
  onSelect: (recipeId: string) => void
}

export default function RecipeItem({ recipe, isSelected, onSelect }: RecipeItemProps) {
  return (
    <button
      key={recipe.id}
      onClick={() => onSelect(recipe.id)}
      className={`w-full text-left px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-gray-100' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-gray-800">{recipe.name}</div>
        </div>
      </div>
    </button>
  )
}
