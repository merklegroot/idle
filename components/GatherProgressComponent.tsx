import { getResourceColorClass, getResourceDisplayName } from "@/models/ResourceType";

export default function GatherProgressComponent({ gatheringProgress }: { gatheringProgress: { isActive: boolean, progress: number, tile: { x: number, y: number }, resourceType: 'stick' | 'stone' | 'thatch' | 'water' | 'construct-lean-to' } }) {
  const resourceColorClass = gatheringProgress.resourceType === 'construct-lean-to' ? 'text-blue-600' : getResourceColorClass(gatheringProgress.resourceType);

  const resourceDisplayName = gatheringProgress.resourceType === 'construct-lean-to' ? 'Lean-to' : getResourceDisplayName(gatheringProgress.resourceType);

  const verb = gatheringProgress.resourceType === 'water' ? 'Drinking' : 
              gatheringProgress.resourceType === 'construct-lean-to' ? 'Constructing' : 'Gathering';

  return (
    <h3 className={`text-lg font-semibold ${resourceColorClass}`}>
        {verb} {resourceDisplayName} at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})
    </h3>
  )
}
