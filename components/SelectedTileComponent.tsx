'use client'

import { GatherButton } from "./GatherButton";

interface SelectedTileComponentProps {
  selectedTile: { x: number; y: number } | null;
  tileType: string | null;
  containsTree: boolean;
  containsStone: boolean;
  containsThatch: boolean;
  containsWater: boolean;
  onGatherStick?: () => void;
  onGatherStone?: () => void;
  onGatherThatch?: () => void;
  onDrinkWater?: () => void;
  onClose?: () => void;
  isGathering?: boolean;
}

function getTileTypeText(tileType: string | null | undefined) {
  if (tileType === 'g')
    return 'Grass';

  if (tileType === 'p')
    return 'Path';

  if (tileType === 'l')
    return 'Housing Plot';

  if (tileType === 'w')
    return 'Water';

  return 'Unknown';
}

function getTileTypeIcon(tileType: string | null | undefined) {
  if (tileType === 'g')
    return '🌱';

  if (tileType === 'p')
    return '🛤️';

  if (tileType === 'l')
    return '🏠';

  if (tileType === 'w')
    return '🌊';

  return '❓';
}

export default function SelectedTileComponent({
  selectedTile,
  tileType,
  containsTree,
  containsStone,
  containsThatch,
  containsWater,
  onGatherStick,
  onGatherStone,
  onGatherThatch,
  onDrinkWater,
  onClose,
  isGathering = false
}: SelectedTileComponentProps) {
  if (!selectedTile)
    return null

  function getResourcesText() {
    let resources: string[] = [];
    if (containsTree)
      resources.push('Tree');

    if (containsStone)
      resources.push('Stone');

    if (containsThatch)
      resources.push('Thatch');

    if (containsWater)
      resources.push('Water');

    if (resources.length === 0)
      return 'None';

    return resources.join(', ');
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">{getTileTypeIcon(tileType)}</span>
          {getTileTypeText(tileType)} ({selectedTile.x}, {selectedTile.y})
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            aria-label="Close tile information"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

      </div>

      <div className="space-y-3">
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Resources:</span> {getResourcesText()}</p>
        </div>

        {containsTree && onGatherStick && (
          <div className="mt-3">
            <GatherButton resourceType="stick" isActing={isGathering} onPress={onGatherStick} />
          </div>
        )}

        {containsStone && onGatherStone && (
          <div className="mt-3">
            <GatherButton resourceType="stone" isActing={isGathering} onPress={onGatherStone} />
          </div>
        )}

        {containsThatch && onGatherThatch && (
          <div className="mt-3">
            <GatherButton resourceType="thatch" isActing={isGathering} onPress={onGatherThatch} />
          </div>
        )}

        {tileType === 'w' && onDrinkWater && (
          <div className="mt-3">
            <GatherButton resourceType="water" isActing={isGathering} onPress={onDrinkWater} />
          </div>
        )}
      </div>
    </div>
  )
}
