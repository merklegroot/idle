import { resourceUtil } from "@/utils/resourceUtil";
import { ResourceType } from "@/models/ResourceType";
import { CRAFTING_RECIPES } from "@/constants/CraftingRecipes";

type GatheringActionType = ResourceType | 'construct-lean-to' | 'craft-twine' | 'craft-knapped-axe-head' | 'craft-tool-handle-recipe' | 'craft-flimsy-axe-recipe';

function getResourceTypeFromActionType(actionType: GatheringActionType): ResourceType | null {
  // Check if the actionType matches a recipe ID directly
  const recipe = CRAFTING_RECIPES.find(r => r.id === actionType);
  if(!recipe) throw Error(`Recipe not found for action type: ${actionType}`);
  
  return recipe.result.resourceKey;
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
