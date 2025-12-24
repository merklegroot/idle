import { resourceUtil } from "@/utils/resourceUtil";
import { ResourceType } from "@/models/ResourceType";
import { CRAFTING_RECIPES } from "@/constants/craftingRecipes";

type GatheringActionType = ResourceType | 'construct-lean-to' | 'craft-twine' | 'craft-knapped-axe-head' | 'craft-tool-handle-recipe' | 'craft-flimsy-axe-recipe';

// Build explicit mapping from action types to recipe IDs
// This avoids relying on string manipulation conventions
const ACTION_TYPE_TO_RECIPE_ID_MAP: Record<string, string> = {};
CRAFTING_RECIPES.forEach(recipe => {
  // Map both the recipe ID directly and with "craft-" prefix if it's a crafting action
  ACTION_TYPE_TO_RECIPE_ID_MAP[recipe.id] = recipe.id;
  ACTION_TYPE_TO_RECIPE_ID_MAP[`craft-${recipe.id}`] = recipe.id;
});

function getResourceTypeFromActionType(actionType: GatheringActionType): ResourceType | null {
  // Look up the recipe ID for this action type
  const recipeId = ACTION_TYPE_TO_RECIPE_ID_MAP[actionType];
  
  if (recipeId) {
    // Find the recipe and return its result resource key
    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    if (recipe) {
      return recipe.result.resourceKey;
    }
  }
  
  // Handle construct-lean-to (not a resource type)
  if (actionType === 'construct-lean-to') {
    return null;
  }
  
  // Regular resource types
  return actionType as ResourceType;
}

export default function GatherProgressComponent(
  { gatheringProgress }: { gatheringProgress: 
    { isActive: boolean, progress: number, tile: { x: number, y: number }, 
    resourceType: GatheringActionType } }) {
  const actualResourceType = getResourceTypeFromActionType(gatheringProgress.resourceType);
  
  // Handle special cases that don't have resource types
  if (!actualResourceType) {
    if (gatheringProgress.resourceType === 'construct-lean-to') {
      return (
        <h3 className="text-lg font-semibold text-gray-700">
          Constructing Lean-to at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})
        </h3>
      );
    }
    return (
      <h3 className="text-lg font-semibold text-gray-700">
        Unknown action
      </h3>
    );
  }
  
  const resourceColorClass = resourceUtil.getResourceColorClass(actualResourceType);
  const resourceDisplayName = resourceUtil.getResourceDisplayName(actualResourceType);
  const actionVerb = resourceUtil.getActionVerb(actualResourceType);
  const resource = resourceUtil.getResourceDef(actualResourceType);
  
  return (
    <h3 className={`text-lg font-semibold ${resourceColorClass}`}>
        {actionVerb} {resourceDisplayName}
        {resource?.isGatherable && (
          <> at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})</>
        )}
    </h3>
  )
}
