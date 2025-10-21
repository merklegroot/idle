'use client'

import useGameStore from '@/stores/gameStore'

interface RecipeItemProps {
  recipe: any
  isSelected: boolean
  onSelect: (recipeId: string) => void
}

export default function RecipeItem({ recipe, isSelected, onSelect }: RecipeItemProps) {
  const { canCraftRecipe } = useGameStore()
  
  const canCraft = canCraftRecipe(recipe.id)

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
}
