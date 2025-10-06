interface SliceDefinition {
  id: string;
  imagePath: string;
  imageName: string;
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
}

interface SavedDefinitionsListProps {
  definitions: SliceDefinition[];
  onLoadDefinition: (definition: SliceDefinition) => void;
  onDeleteDefinition: (definitionId: string) => void;
}

export default function SavedDefinitionsList({
  definitions,
  onLoadDefinition,
  onDeleteDefinition
}: SavedDefinitionsListProps) {
  if (definitions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Saved Definitions</h2>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {definitions.map((definition) => (
          <div key={definition.id} className="bg-gray-700 rounded p-3 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate" title={definition.imageName}>
                {definition.imageName}
              </div>
              <div className="text-xs text-gray-400">
                {definition.gridWidth}×{definition.gridHeight} | 
                Offset: {definition.offsetX},{definition.offsetY} | 
                Spacing: {definition.spacingX},{definition.spacingY}
              </div>
            </div>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => onLoadDefinition(definition)}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
              >
                Load
              </button>
              <button
                onClick={() => onDeleteDefinition(definition.id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
