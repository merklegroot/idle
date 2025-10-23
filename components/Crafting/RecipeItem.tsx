'use client'

import useGameStore from '@/stores/gameStore'
import { WoodDef, BerryDef, StoneDef, GoldDef, ResourceDef, StickDef, ThatchDef, TwineDef, KnappedAxeHeadDef } from '@/app/models/ResourceDef'

interface RecipeItemProps {
  recipe: any
  isSelected: boolean
  onSelect: (recipeId: string) => void
}

export default function RecipeItem({ recipe, isSelected, onSelect }: RecipeItemProps) {
  // Create a lookup map for resource icons
  const resourceDefs: ResourceDef[] = [WoodDef, BerryDef, StoneDef, GoldDef, StickDef, ThatchDef, TwineDef, KnappedAxeHeadDef];
  const resourceIconMap = resourceDefs.reduce((map, def) => {
    map[def.resourceKey] = def.icon;
    return map;
  }, {} as Record<string, string>);

  // Get the icon for the recipe result
  const resultIcon = resourceIconMap[recipe.result.resourceKey] || '❓';

  return (
    <button
      key={recipe.id}
      onClick={() => onSelect(recipe.id)}
      className={`w-full text-left px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-gray-100' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-lg">{resultIcon}</div>
          <div>
            <div className="text-sm font-medium text-gray-800">{recipe.name}</div>
          </div>
        </div>
      </div>
    </button>
  )
}
