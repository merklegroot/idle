import { getResourceColorClass, getResourceDisplayName } from "@/models/ResourceType";

export default function GatherProgressComponent({ gatheringProgress }: { gatheringProgress: { isActive: boolean, progress: number, tile: { x: number, y: number }, resourceType: 'stick' | 'stone' | 'thatch' | 'water' } }) {
  const resourceColorClass = getResourceColorClass(gatheringProgress.resourceType);

  const resourceDisplayName = getResourceDisplayName(gatheringProgress.resourceType);

  const verb = gatheringProgress.resourceType === 'water' ? 'Drinking' : 'Gathering';

  return (
    <h3 className={`text-lg font-semibold ${resourceColorClass}`}>
        {verb} {resourceDisplayName} at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})
    </h3>
  )
}
