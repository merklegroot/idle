'use client'

import { TerrainEnum } from "@/models/TerrainEnum";
import { GatherButton } from "./GatherButton";

interface SelectedTileComponentProps {
  selectedTile: { x: number; y: number } | null;
  terrainType: TerrainEnum | undefined | null;
  containsTree: boolean;
  containsStone: boolean;
  containsThatch: boolean;
  containsWater: boolean;
  hasLeanTo?: boolean;
  onGatherStick?: () => void;
  onGatherStone?: () => void;
  onGatherThatch?: () => void;
  onDrinkWater?: () => void;
  onConstructLeanTo?: () => void;
  onClose?: () => void;
  isGathering?: boolean;
  canConstructLeanTo?: boolean;
}

function getTileTypeText(terrainType: TerrainEnum | undefined | null) {
  if (terrainType === TerrainEnum.Grass)
    return 'Grass';

  if (terrainType === TerrainEnum.Path)
    return 'Path';

  if (terrainType === TerrainEnum.HousingPlot)
    return 'Housing Plot';

  if (terrainType === TerrainEnum.Water)
    return 'Water';

  return 'Unknown';
}

function getTileTypeIcon(terrainType: TerrainEnum | undefined | null) {
  if (terrainType === TerrainEnum.Grass)
    return '🌱';

  if (terrainType === TerrainEnum.Path)
    return '🛤️';

  if (terrainType === TerrainEnum.HousingPlot)
    return '🏠';

  if (terrainType === TerrainEnum.Water)
    return '🌊';

  return '❓';
}

export default function SelectedTileComponent({
  selectedTile,
  terrainType,
  containsTree,
  containsStone,
  containsThatch,
  containsWater,
  hasLeanTo = false,
  onGatherStick,
  onGatherStone,
  onGatherThatch,
  onDrinkWater,
  onConstructLeanTo,
  onClose,
  isGathering = false,
  canConstructLeanTo = false
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
          <span className="text-2xl">{getTileTypeIcon(terrainType)}</span>
          {getTileTypeText(terrainType)} ({selectedTile.x}, {selectedTile.y})
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

        {containsWater && onDrinkWater && (
          <div className="mt-3">
            <GatherButton resourceType="water" isActing={isGathering} onPress={onDrinkWater} />
          </div>
        )}

        {/* Construction section for housing plots */}
        {terrainType === TerrainEnum.HousingPlot && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Construction</h3>
            {hasLeanTo ? (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏕️</span>
                  <span>Lean-to constructed</span>
                </div>
                <div className="text-xs text-green-500 mt-1">This plot has a lean-to</div>
              </div>
            ) : canConstructLeanTo && onConstructLeanTo ? (
              <button
                onClick={onConstructLeanTo}
                disabled={isGathering}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span className="text-lg">🏠</span>
                <span>Construct Lean-to (1 stick)</span>
              </button>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏠</span>
                  <span>Construct Lean-to (1 stick)</span>
                </div>
                <div className="text-xs text-red-500 mt-1">Insufficient resources</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
