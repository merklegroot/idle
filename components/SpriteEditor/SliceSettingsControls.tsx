interface SliceSettings {
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
  description: string;
  type: 'Unknown' | 'Image' | 'Tile Sheet' | 'Sprite Sheet';
}

interface SliceSettingsControlsProps {
  sliceSettings: SliceSettings;
  onSettingChange: (key: keyof SliceSettings, value: number | string) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
  slicedSpritesCount: number;
  hasSlicingParams: boolean;
  onToggleSlicing: () => void;
}

export default function SliceSettingsControls({
  sliceSettings,
  onSettingChange,
  onSave,
  isSaving,
  saveMessage,
  slicedSpritesCount,
  hasSlicingParams,
  onToggleSlicing
}: SliceSettingsControlsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Slice Settings</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description (Optional)
        </label>
        <input
          type="text"
          value={sliceSettings.description}
          onChange={(e) => onSettingChange('description', e.target.value)}
          placeholder="Enter a description for this sprite sheet..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Type
        </label>
        <select
          value={sliceSettings.type}
          onChange={(e) => onSettingChange('type', e.target.value as 'Unknown' | 'Image' | 'Tile Sheet' | 'Sprite Sheet')}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        >
          <option value="Unknown">Unknown</option>
          <option value="Image">Image</option>
          <option value="Tile Sheet">Tile Sheet</option>
          <option value="Sprite Sheet">Sprite Sheet</option>
        </select>
      </div>
      
      {/* Slicing Parameters Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Slicing Parameters</h3>
          <button
            onClick={onToggleSlicing}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              hasSlicingParams
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {hasSlicingParams ? '− Remove Slicing' : '+ Add Slicing'}
          </button>
        </div>
        
        {hasSlicingParams ? (
          <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Grid Width
          </label>
          <input
            type="number"
            value={sliceSettings.gridWidth}
            onChange={(e) => onSettingChange('gridWidth', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            min="1"
            step="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Grid Height
          </label>
          <input
            type="number"
            value={sliceSettings.gridHeight}
            onChange={(e) => onSettingChange('gridHeight', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            min="1"
            step="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Offset X
          </label>
          <input
            type="number"
            value={sliceSettings.offsetX}
            onChange={(e) => onSettingChange('offsetX', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Offset Y
          </label>
          <input
            type="number"
            value={sliceSettings.offsetY}
            onChange={(e) => onSettingChange('offsetY', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Spacing X
          </label>
          <input
            type="number"
            value={sliceSettings.spacingX}
            onChange={(e) => onSettingChange('spacingX', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Spacing Y
          </label>
          <input
            type="number"
            value={sliceSettings.spacingY}
            onChange={(e) => onSettingChange('spacingY', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            min="0"
          />
          </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm italic">
            No slicing parameters defined. Click "+ Add Slicing" to define grid dimensions and offsets.
          </div>
        )}
      </div>
      
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onSave}
          disabled={isSaving || slicedSpritesCount === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
        >
          {isSaving ? 'Saving...' : 'Save Definition'}
        </button>
        
        {saveMessage && (
          <div className={`text-sm ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}
