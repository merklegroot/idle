import { resourceUtil } from "@/utils/resourceUtil";
import { ResourceType } from "@/models/ResourceType";

type GatheringActionType = ResourceType | 'construct-lean-to' | 'craft-twine' | 'craft-knapped-axe-head' | 'craft-tool-handle-recipe' | 'craft-flimsy-axe-recipe';

export default function GatherProgressComponent(
  { gatheringProgress }: { gatheringProgress: 
    { isActive: boolean, progress: number, tile: { x: number, y: number }, 
    resourceType: GatheringActionType } }) {
  const resourceColorClass = resourceUtil.getResourceColorClass(gatheringProgress.resourceType as ResourceType);
  const resourceDisplayName = resourceUtil.getResourceDisplayName(gatheringProgress.resourceType as ResourceType);
  const actionVerb = resourceUtil.getActionVerb(gatheringProgress.resourceType as ResourceType);
  const resource = resourceUtil.getResourceDef(gatheringProgress.resourceType as ResourceType);
  
  return (
    <h3 className={`text-lg font-semibold ${resourceColorClass}`}>
        {actionVerb} {resourceDisplayName}
        {resource?.isGatherable && (
          <> at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})</>
        )}
    </h3>
  )
}
