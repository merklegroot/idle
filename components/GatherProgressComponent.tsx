import { resourceUtil } from "@/utils/resourceUtil";
import { ResourceId } from "@/constants/ResourceDefs";
import { CRAFTING_RECIPES, CraftingRecipeId } from "@/constants/CraftingRecipeDefs";
import { GatherActionId } from "@/constants/GatherDefs";
import { ActionId } from "@/constants/ActionDefs";
import { GATHER_ACTION_DEFS, GatherActionDef } from "@/constants/GatherDefs";

function getResourceTypeFromActionType(actionId: ActionId): ResourceId | null {
  const gatherAction = GATHER_ACTION_DEFS.find(g => g.id === actionId);
  if (gatherAction) return gatherAction.resultingResourceId;

  // Check if the actionType matches a recipe ID directly
  const recipe = CRAFTING_RECIPES.find(r => r.id === actionId);
  if (!recipe) throw Error(`Recipe not found for action id: ${actionId}`);
  
  return recipe.resultingResourceId;
}

export default function GatherProgressComponent(
  { gatheringProgress }: { gatheringProgress: 
    { isActive: boolean, progress: number, tile: { x: number, y: number }, 
    actionId: CraftingRecipeId | GatherActionId } }) {
  const actualResourceType = getResourceTypeFromActionType(gatheringProgress.actionId);
  
  // Handle special cases that don't have resource types
  if (!actualResourceType) {
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
