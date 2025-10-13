'use client'

interface SelectedTileComponentProps {
  selectedTile: { x: number; y: number } | null
  tileType: string | null
  containsTree: boolean
  containsStone: boolean
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
  containsStone
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
            <p><span className="font-medium">Type:</span> {getTileTypeText(tileType)}</p>
            <p><span className="font-medium">Resources:</span>{getResourcesText()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
