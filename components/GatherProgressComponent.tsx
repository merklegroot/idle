import { resourceUtil } from "@/utils/resourceUtil";
import { ResourceType } from "@/models/ResourceType";

export default function GatherProgressComponent(
  { gatheringProgress }: { gatheringProgress: 
    { isActive: boolean, progress: number, tile: { x: number, y: number }, 
    resourceType: ResourceType } }) {
  const resourceColorClass = resourceUtil.getResourceColorClass(gatheringProgress.resourceType);
  const resourceDisplayName = resourceUtil.getResourceDisplayName(gatheringProgress.resourceType);
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
