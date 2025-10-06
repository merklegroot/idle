interface SliceDefinition {
  id: string;
  imagePath: string;
  imageName: string;
  imageWidth: number;
  imageHeight: number;
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
  description: string;
  type: 'Unknown' | 'Image' | 'Tile Sheet' | 'Sprite Sheet';
}

interface SavedDefinitionsListProps {
  definition: SliceDefinition | null;
  onLoadDefinition: (definition: SliceDefinition) => void;
  onDeleteDefinition: (definitionId: string) => void;
}

export default function SavedDefinitionsList({
  definition,
  onLoadDefinition,
  onDeleteDefinition
}: SavedDefinitionsListProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Saved Definition</h2>
      {definition ? (
        <div className="bg-green-900 border border-green-700 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium text-green-300">Definition Saved</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-white">
              {definition.imageName}
            </div>
            <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              {definition.type}
            </div>
          </div>
          {definition.description && (
            <div className="text-xs text-gray-200 mb-2 italic">
              "{definition.description}"
            </div>
          )}
          <div className="text-xs text-gray-300 mb-2">
            Image: {definition.imageWidth}×{definition.imageHeight}px
          </div>
          {definition.gridWidth > 0 && definition.gridHeight > 0 ? (
            <div className="text-xs text-gray-300 mb-4">
              <span className="text-green-400">✓ Slicing Enabled</span> | 
              Grid: {definition.gridWidth}×{definition.gridHeight} | 
              Offset: {definition.offsetX},{definition.offsetY} | 
              Spacing: {definition.spacingX},{definition.spacingY}
            </div>
          ) : (
            <div className="text-xs text-gray-400 mb-4">
              <span className="text-gray-500">○ No Slicing</span> - Image only, no grid slicing defined
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => onLoadDefinition(definition)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
            >
              Load Settings
            </button>
            <button
              onClick={() => onDeleteDefinition(definition.id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
            >
              Remove Definition
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-700 border border-gray-600 rounded p-4 text-center">
          <div className="text-gray-400 text-sm">
            No definition saved for this sprite sheet
          </div>
        </div>
      )}
    </div>
  );
}
