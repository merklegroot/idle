'use client'

interface SelectedTileComponentProps {
  selectedTile: { x: number; y: number } | null
  tileType: string | null
  containsTree: boolean
  containsStone: boolean
  containsThatch: boolean
  onGatherStick?: () => void
  onGatherStone?: () => void
  onGatherThatch?: () => void
  isGathering?: boolean
}

function getTileTypeText(tileType: string | null | undefined) {
  if (tileType === 'g')
    return 'Grass';

  if (tileType === 'p')
    return 'Path';

  if (tileType === 'l')
    return 'Housing Plot';

  return 'Unknown';
}

export default function SelectedTileComponent({ 
  selectedTile, 
  tileType,
  containsTree,
  containsStone,
  containsThatch,
  onGatherStick,
  onGatherStone,
  onGatherThatch,
  isGathering = false
}: SelectedTileComponentProps) {
  if (!selectedTile) {
    return null
  }


  function getResourcesText() { 
    let resources: string[] = [];
    if (containsTree)
      resources.push('Tree');
    
    if (containsStone)
      resources.push('Stone');

    if (containsThatch)
      resources.push('Thatch');

    if(resources.length === 0)
      return 'None';

    return resources.join(', ');
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tile Information</h2>
      
      <div className="space-y-3">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold text-yellow-800 mb-2">Selected Tile</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Position:</span> ({selectedTile.x}, {selectedTile.y})</p>
              <p><span className="font-medium">Terrain:</span> {getTileTypeText(tileType)}</p>
              <p><span className="font-medium">Resources:</span> {getResourcesText()}</p>
            </div>
          </div>
          
          {containsTree && onGatherStick && (
            <div className="mt-3">
              <button
                onClick={onGatherStick}
                disabled={isGathering}
                className={`w-full px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ${
                  isGathering
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isGathering ? 'Gathering...' : 'Gather Stick'}
              </button>
            </div>
          )}
          
          {containsStone && onGatherStone && (
            <div className="mt-3">
              <button
                onClick={onGatherStone}
                disabled={isGathering}
                className={`w-full px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ${
                  isGathering
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isGathering ? 'Gathering...' : 'Gather Stone'}
              </button>
            </div>
          )}
          
          {containsThatch && onGatherThatch && (
            <div className="mt-3">
              <button
                onClick={onGatherThatch}
                disabled={isGathering}
                className={`w-full px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ${
                  isGathering
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {isGathering ? 'Gathering...' : 'Gather Thatch'}
              </button>
            </div>
          )}
        </div>
    </div>
  )
}
