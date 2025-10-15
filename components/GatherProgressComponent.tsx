export default function GatherProgressComponent({ gatheringProgress }: { gatheringProgress: { isActive: boolean, progress: number, tile: { x: number, y: number }, resourceType: 'stick' | 'stone' | 'thatch' | 'water' } }) {
  const resourceColorClass = 
    gatheringProgress.resourceType === 'stick' ? 'text-green-800' :
    gatheringProgress.resourceType === 'thatch' ? 'text-yellow-800' :
    gatheringProgress.resourceType === 'stone' ? 'text-gray-800' :
    gatheringProgress.resourceType === 'water' ? 'text-blue-800' :
    'text-gray-800';

  const resourceDisplayName = gatheringProgress.resourceType === 'stick' ? 'Sticks' 
    : gatheringProgress.resourceType === 'thatch' ? 'Thatch'
    : gatheringProgress.resourceType === 'stone' ? 'Stone'
    : gatheringProgress.resourceType === 'water' ? 'Water'
    : gatheringProgress.resourceType;

  const verb = gatheringProgress.resourceType === 'water' ? 'Drinking' : 'Gathering';

  return (
    <h3 className={`text-lg font-semibold ${resourceColorClass}`}>
        {verb} {resourceDisplayName} at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})
    </h3>
  )
}