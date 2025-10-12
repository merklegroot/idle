import JSZip from 'jszip';

interface SliceSettings {
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
  drawingOffsetX: number | string;
  drawingOffsetY: number | string;
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
  slicedSprites: string[];
  imageName: string;
}

export default function SliceSettingsControls({
  sliceSettings,
  onSettingChange,
  onSave,
  isSaving,
  saveMessage,
  slicedSpritesCount,
  hasSlicingParams,
  onToggleSlicing,
  slicedSprites,
  imageName
}: SliceSettingsControlsProps) {
  const downloadSlicedTiles = async () => {
    if (slicedSprites.length === 0) {
      alert('No sliced tiles available to download. Please configure slicing parameters first.');
      return;
    }

    try {
      const zip = new JSZip();
      
      // Add each sliced sprite to the ZIP
      slicedSprites.forEach((spriteDataUrl, index) => {
        // Convert data URL to blob
        const base64Data = spriteDataUrl.split(',')[1];
        const binaryData = atob(base64Data);
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }
        
        // Add to ZIP with a descriptive filename
        const fileName = `${imageName.replace(/\.[^/.]+$/, '')}_slice_${String(index + 1).padStart(3, '0')}.png`;
        zip.file(fileName, bytes);
      });

      // Generate and download the ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName.replace(/\.[^/.]+$/, '')}_sliced_tiles.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  };

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
      
      {/* Slicing Parameters Section - Only show for Tile Sheet and Sprite Sheet */}
      {(sliceSettings.type === 'Tile Sheet' || sliceSettings.type === 'Sprite Sheet') && (
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
      )}
      
      {/* Drawing Offset Section - Always visible for all image types */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-3">Drawing Offset</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Drawing Offset X
            </label>
            <input
              type="text"
              value={sliceSettings.drawingOffsetX ?? 0}
              onChange={(e) => onSettingChange('drawingOffsetX', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Drawing Offset Y
            </label>
            <input
              type="text"
              value={sliceSettings.drawingOffsetY ?? 0}
              onChange={(e) => onSettingChange('drawingOffsetY', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="0"
            />
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Additional offset applied when drawing this image on the map (in addition to automatic centering)
        </p>
      </div>
      
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onSave}
          disabled={isSaving || slicedSpritesCount === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
        >
          {isSaving ? 'Saving...' : 'Save Definition'}
        </button>
        
        <button
          onClick={downloadSlicedTiles}
          disabled={slicedSpritesCount === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Tiles ({slicedSpritesCount})
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
