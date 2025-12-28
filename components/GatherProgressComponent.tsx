import { resourceUtil } from "@/utils/resourceUtil";
import { ResourceId } from "@/constants/ResourceDefs";
import { CRAFTING_RECIPES } from "@/constants/CraftingRecipeDefs";
import { ActionId } from "@/constants/ActionDefs";
import { ALL_GATHER_ACTION_DEFS } from "@/constants/GatherDefs";
import { GatheringProgressProps } from "./GatheringProgressDisplay";

function getResourceTypeFromActionType(actionId: ActionId): ResourceId | null {
  const gatherAction = ALL_GATHER_ACTION_DEFS.find(g => g.id === actionId);
  if (gatherAction) return gatherAction.resultingResourceId;

  // Check if the actionType matches a recipe ID directly
  const recipe = CRAFTING_RECIPES.find(r => r.id === actionId);
  if (!recipe) throw Error(`Recipe not found for action id: ${actionId}`);
  
  return recipe.resultingResourceId;
}

export default function GatherProgressComponent(
  { gatheringProgress }: { gatheringProgress: GatheringProgressProps }) {
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
