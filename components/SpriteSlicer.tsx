'use client';

import { useState, useRef, useEffect } from 'react';

interface SliceSettings {
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
}

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
  createdAt: string;
  updatedAt: string;
}

interface SpriteSlicerProps {
  imageSrc: string;
  imageName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SpriteSlicer({ imageSrc, imageName, isOpen, onClose }: SpriteSlicerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sliceSettings, setSliceSettings] = useState<SliceSettings>({
    gridWidth: 32,
    gridHeight: 32,
    offsetX: 0,
    offsetY: 0,
    spacingX: 0,
    spacingY: 0
  });
  const [slicedSprites, setSlicedSprites] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [savedDefinitions, setSavedDefinitions] = useState<SliceDefinition[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load saved definitions when component opens
  useEffect(() => {
    if (isOpen) {
      loadSavedDefinitions();
    }
  }, [isOpen]);

  // Handle escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Load image and get dimensions
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setImageLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Load saved definitions
  const loadSavedDefinitions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/assets/slice-definitions');
      const data = await response.json();
      if (data.success) {
        setSavedDefinitions(data.definitions);
        // Check if there's a saved definition for this image
        const existingDefinition = data.definitions.find((def: SliceDefinition) => def.imagePath === imageSrc);
        if (existingDefinition) {
          setSliceSettings({
            gridWidth: existingDefinition.gridWidth,
            gridHeight: existingDefinition.gridHeight,
            offsetX: existingDefinition.offsetX,
            offsetY: existingDefinition.offsetY,
            spacingX: existingDefinition.spacingX,
            spacingY: existingDefinition.spacingY
          });
        }
      }
    } catch (error) {
      console.error('Error loading definitions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update preview when settings change
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Calculate how many sprites we can fit
      const { gridWidth, gridHeight, offsetX, offsetY, spacingX, spacingY } = sliceSettings;
      
      // Safety checks to prevent crashes
      if (gridWidth <= 0 || gridHeight <= 0) {
        console.warn('Invalid grid dimensions, skipping preview');
        return;
      }
      
      if (offsetX < 0 || offsetY < 0 || spacingX < 0 || spacingY < 0) {
        console.warn('Invalid offset or spacing values, skipping preview');
        return;
      }
      
      const availableWidth = img.width - offsetX;
      const availableHeight = img.height - offsetY;
      
      // Additional safety check
      if (availableWidth <= 0 || availableHeight <= 0) {
        console.warn('Invalid available dimensions, skipping preview');
        return;
      }
      
      const cols = Math.ceil((availableWidth + spacingX) / (gridWidth + spacingX));
      const rows = Math.ceil((availableHeight + spacingY) / (gridHeight + spacingY));
      
      // Prevent infinite loops
      if (cols <= 0 || rows <= 0 || cols > 1000 || rows > 1000) {
        console.warn('Invalid grid calculation, skipping preview');
        return;
      }
      
      // Set canvas size to show all sprites (base size)
      // Use the actual image dimensions to ensure we show the complete image
      const baseCanvasWidth = Math.max(cols * (gridWidth + 4), img.width + 4);
      const baseCanvasHeight = Math.max(rows * (gridHeight + 4), img.height + 4);
      
      // Scale canvas size based on zoom level
      const canvasWidth = baseCanvasWidth * zoomLevel;
      const canvasHeight = baseCanvasHeight * zoomLevel;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Apply pan transformations (zoom is handled by canvas size)
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      
      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw grid lines (using base dimensions)
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= cols; i++) {
        const x = i * (gridWidth + 4);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, baseCanvasHeight);
        ctx.stroke();
      }
      
      for (let i = 0; i <= rows; i++) {
        const y = i * (gridHeight + 4);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(baseCanvasWidth, y);
        ctx.stroke();
      }
      
      // Draw sprite previews
      const sprites: string[] = [];
      
      // Use the maximum number of rows and columns to cover the full image
      const maxCols = Math.ceil(img.width / (gridWidth + spacingX));
      const maxRows = Math.ceil(img.height / (gridHeight + spacingY));
      
      for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < maxCols; col++) {
          const sourceX = offsetX + col * (gridWidth + spacingX);
          const sourceY = offsetY + row * (gridHeight + spacingY);
          
          // Check if this sprite starts within bounds (allow partial tiles)
          if (sourceX < img.width && sourceY < img.height) {
            const destX = col * (gridWidth + 4) + 2;
            const destY = row * (gridHeight + 4) + 2;
            
            // Calculate actual dimensions for partial tiles
            const actualWidth = Math.min(gridWidth, img.width - sourceX);
            const actualHeight = Math.min(gridHeight, img.height - sourceY);
            
            // Draw sprite (using actual dimensions for partial tiles)
            ctx.drawImage(
              img,
              sourceX, sourceY, actualWidth, actualHeight,
              destX, destY, actualWidth, actualHeight
            );
            
            // Store sprite data URL for download
            const spriteCanvas = document.createElement('canvas');
            const spriteCtx = spriteCanvas.getContext('2d');
            if (spriteCtx) {
              spriteCanvas.width = actualWidth;
              spriteCanvas.height = actualHeight;
              spriteCtx.drawImage(
                img,
                sourceX, sourceY, actualWidth, actualHeight,
                0, 0, actualWidth, actualHeight
              );
              sprites.push(spriteCanvas.toDataURL());
            }
          }
        }
      }
      
      setSlicedSprites(sprites);
      
      // Restore context after drawing
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageLoaded, sliceSettings, zoomLevel, panOffset]);

  const handleSettingChange = (key: keyof SliceSettings, value: number) => {
    // Prevent zero or negative values for grid dimensions
    if (key === 'gridWidth' || key === 'gridHeight') {
      value = Math.max(1, value); // Minimum 1 pixel
    } else {
      value = Math.max(0, value); // Other values can be 0
    }
    
    setSliceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const downloadSprite = (index: number) => {
    const link = document.createElement('a');
    link.download = `${imageName}_sprite_${index + 1}.png`;
    link.href = slicedSprites[index];
    link.click();
  };

  const downloadAllSprites = () => {
    slicedSprites.forEach((sprite, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `${imageName}_sprite_${index + 1}.png`;
        link.href = sprite;
        link.click();
      }, index * 100); // Stagger downloads
    });
  };

  const saveDefinition = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/assets/slice-definitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagePath: imageSrc,
          imageName,
          ...sliceSettings
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSaveMessage('Definition saved successfully!');
        // Reload definitions to get updated list
        await loadSavedDefinitions();
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving definition:', error);
      setSaveMessage('Error saving definition');
    } finally {
      setIsSaving(false);
    }
  };

  const loadDefinition = (definition: SliceDefinition) => {
    setSliceSettings({
      gridWidth: definition.gridWidth,
      gridHeight: definition.gridHeight,
      offsetX: definition.offsetX,
      offsetY: definition.offsetY,
      spacingX: definition.spacingX,
      spacingY: definition.spacingY
    });
  };

  const deleteDefinition = async (definitionId: string) => {
    try {
      const response = await fetch(`/api/assets/slice-definitions?id=${definitionId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        await loadSavedDefinitions();
      }
    } catch (error) {
      console.error('Error deleting definition:', error);
    }
  };

  const generateSpriteDefinitions = async () => {
    setIsGenerating(true);
    setGenerationMessage('');
    
    try {
      const response = await fetch('/api/assets/generate-sprites', {
        method: 'POST'
      });
      
      const data = await response.json();
      if (data.success) {
        setGenerationMessage(data.message);
        setTimeout(() => setGenerationMessage(''), 5000);
      } else {
        setGenerationMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error generating sprite definitions:', error);
      setGenerationMessage('Error generating sprite definitions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleZoom = (delta: number) => {
    const zoomFactor = 0.1;
    const newZoom = Math.max(0.1, Math.min(5, zoomLevel - delta * zoomFactor));
    setZoomLevel(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col">
        <div className="flex flex-1 min-h-0">
          {/* Controls Panel */}
          <div className="w-80 p-6 border-r border-gray-700 overflow-y-auto flex-shrink-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Sprite Slicer</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grid Width
                </label>
                <input
                  type="number"
                  value={sliceSettings.gridWidth}
                  onChange={(e) => handleSettingChange('gridWidth', parseInt(e.target.value) || 1)}
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
                  onChange={(e) => handleSettingChange('gridHeight', parseInt(e.target.value) || 1)}
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
                  onChange={(e) => handleSettingChange('offsetX', parseInt(e.target.value) || 0)}
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
                  onChange={(e) => handleSettingChange('offsetY', parseInt(e.target.value) || 0)}
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
                  onChange={(e) => handleSettingChange('spacingX', parseInt(e.target.value) || 0)}
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
                  onChange={(e) => handleSettingChange('spacingY', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  min="0"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="text-sm text-gray-400">
                <p>Original: {imageDimensions.width} × {imageDimensions.height}</p>
                <p>Sprites: {slicedSprites.length}</p>
              </div>
              
              <button
                onClick={saveDefinition}
                disabled={isSaving || slicedSprites.length === 0}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
              >
                {isSaving ? 'Saving...' : 'Save Definition'}
              </button>
              
              {saveMessage && (
                <div className={`text-sm ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                  {saveMessage}
                </div>
              )}
              
              <button
                onClick={downloadAllSprites}
                disabled={slicedSprites.length === 0}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
              >
                Download All Sprites ({slicedSprites.length})
              </button>
              
              <button
                onClick={generateSpriteDefinitions}
                disabled={isGenerating || savedDefinitions.length === 0}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
              >
                {isGenerating ? 'Generating...' : 'Generate Sprite Definitions'}
              </button>
              
              {generationMessage && (
                <div className={`text-sm ${generationMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                  {generationMessage}
                </div>
              )}
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="flex-1 p-6 overflow-y-auto min-w-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Preview & Definitions</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Saved Definitions */}
            {savedDefinitions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Saved Definitions</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {savedDefinitions.map((definition) => (
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
                          onClick={() => loadDefinition(definition)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteDefinition(definition.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleZoom(-1)}
                    className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded"
                  >
                    -
                  </button>
                  <span className="text-sm text-gray-300 min-w-[3rem] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => handleZoom(1)}
                    className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={resetView}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 rounded p-4 overflow-auto" style={{ maxHeight: '400px' }}>
                <canvas
                  ref={canvasRef}
                  className="border border-gray-600 cursor-grab active:cursor-grabbing"
                  style={{ 
                    maxWidth: 'none', 
                    height: 'auto',
                    minWidth: '100%'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={(e) => {
                    e.preventDefault();
                    handleZoom(e.deltaY / 100);
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Mouse wheel to zoom • Click and drag to pan
              </div>
            </div>
            
            {/* Individual Sprites */}
            {slicedSprites.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Individual Sprites</h3>
                <div className="grid grid-cols-4 gap-2">
                  {slicedSprites.map((sprite, index) => (
                    <div key={index} className="bg-gray-700 rounded p-2 text-center">
                      <img
                        src={sprite}
                        alt={`Sprite ${index + 1}`}
                        className="w-full h-16 object-contain bg-gray-800 rounded mb-2"
                      />
                      <button
                        onClick={() => downloadSprite(index)}
                        className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
