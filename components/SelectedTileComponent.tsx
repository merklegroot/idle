'use client'

interface SelectedTileComponentProps {
  selectedTile: { x: number; y: number } | null
  tileType: string | null
  containsTree: boolean
  containsStone: boolean
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tile Information</h2>
      
      <div className="space-y-3">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold text-yellow-800 mb-2">Selected Tile</p>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Position:</span> ({selectedTile.x}, {selectedTile.y})</p>
            <p><span className="font-medium">Type:</span> {tileType || 'Unknown'}</p>
            {containsTree && (
              <p><span className="font-medium">Contains:</span> Tree</p>
            )}
            {containsStone && (
              <p><span className="font-medium">Contains:</span> Stone</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
