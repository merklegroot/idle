import { getResourceColorClass, getResourceDisplayName } from "@/models/ResourceType";

export default function GatherProgressComponent({ gatheringProgress }: { gatheringProgress: { isActive: boolean, progress: number, tile: { x: number, y: number }, resourceType: 'stick' | 'stone' | 'thatch' | 'water' | 'berry' | 'construct-lean-to' | 'craft-twine' | 'craft-knapped-axe-head' } }) {
  const resourceColorClass = gatheringProgress.resourceType === 'construct-lean-to' ? 'text-blue-600' : 
                            gatheringProgress.resourceType === 'craft-twine' ? 'text-amber-600' : 
                            gatheringProgress.resourceType === 'craft-knapped-axe-head' ? 'text-gray-700' :
                            getResourceColorClass(gatheringProgress.resourceType as any);

  const resourceDisplayName = gatheringProgress.resourceType === 'construct-lean-to' ? 'Lean-to' : 
                              gatheringProgress.resourceType === 'craft-twine' ? 'Twine' : 
                              gatheringProgress.resourceType === 'craft-knapped-axe-head' ? 'Knapped Axe Head' :
                              getResourceDisplayName(gatheringProgress.resourceType as any);

  const verb = gatheringProgress.resourceType === 'water' ? 'Drinking' : 
              gatheringProgress.resourceType === 'construct-lean-to' ? 'Constructing' : 
              (gatheringProgress.resourceType === 'craft-twine' || gatheringProgress.resourceType === 'craft-knapped-axe-head') ? 'Crafting' : 'Gathering';

  return (
    <h3 className={`text-lg font-semibold ${resourceColorClass}`}>
        {verb} {resourceDisplayName}
        {gatheringProgress.resourceType !== 'craft-twine' && gatheringProgress.resourceType !== 'craft-knapped-axe-head' && (
          <> at ({gatheringProgress.tile.x}, {gatheringProgress.tile.y})</>
        )}
    </h3>
  )
}
