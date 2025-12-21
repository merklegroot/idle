import { getResourceColorClass, getResourceDisplayName } from "@/models/ResourceType";
import { ResourceType } from "@/models/ResourceType";
import { resourceUtil } from "@/utils/resourceUtil";

export default function GatherProgressComponent(
  { gatheringProgress }: { gatheringProgress: 
    { isActive: boolean, progress: number, tile: { x: number, y: number }, 
    resourceType: ResourceType } }) {
  const resourceColorClass = getResourceColorClass(gatheringProgress.resourceType);
  const resourceDisplayName = getResourceDisplayName(gatheringProgress.resourceType);
  const actionVerb = resourceUtil.getActionVerb(gatheringProgress.resourceType);
  const resource = resourceUtil.getResourceDef(gatheringProgress.resourceType);
  
  return (
    <h3 className={`text-lg font-semibold ${resourceColorClass}`}>
        {actionVerb} {resourceDisplayName}
        {resource?.isGatherable && (
          <> at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})</>
        )}
    </h3>
  )
}
