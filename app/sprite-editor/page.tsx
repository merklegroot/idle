'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function SpriteEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<{ src: string; name: string } | null>(null);
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load definitions
  useEffect(() => {
    loadSavedDefinitions();
  }, []);

  // Handle URL parameters for pre-selecting an image
  useEffect(() => {
    const imageParam = searchParams.get('image');
    const nameParam = searchParams.get('name');
    
    if (imageParam && nameParam) {
      setSelectedImage({ src: imageParam, name: nameParam });
    }
  }, [searchParams]);

  // Load image and get dimensions
  useEffect(() => {
    if (!selectedImage?.src) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setImageLoaded(true);
    };
    img.src = selectedImage.src;
  }, [selectedImage]);

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
      
      const cols = Math.floor((availableWidth + spacingX) / (gridWidth + spacingX));
      const rows = Math.floor((availableHeight + spacingY) / (gridHeight + spacingY));
      
      // Prevent infinite loops
      if (cols <= 0 || rows <= 0 || cols > 1000 || rows > 1000) {
        console.warn('Invalid grid calculation, skipping preview');
        return;
      }
      
      // Set canvas size to show all sprites (base size)
      const baseCanvasWidth = cols * (gridWidth + 4); // 4px padding between sprites
      const baseCanvasHeight = rows * (gridHeight + 4);
      
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
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const sourceX = offsetX + col * (gridWidth + spacingX);
          const sourceY = offsetY + row * (gridHeight + spacingY);
          
          // Check if this sprite is within bounds
          if (sourceX + gridWidth <= img.width && sourceY + gridHeight <= img.height) {
            const destX = col * (gridWidth + 4) + 2;
            const destY = row * (gridHeight + 4) + 2;
            
            // Draw sprite (using base dimensions)
            ctx.drawImage(
              img,
              sourceX, sourceY, gridWidth, gridHeight,
              destX, destY, gridWidth, gridHeight
            );
            
            // Store sprite data URL for download
            const spriteCanvas = document.createElement('canvas');
            const spriteCtx = spriteCanvas.getContext('2d');
            if (spriteCtx) {
              spriteCanvas.width = gridWidth;
              spriteCanvas.height = gridHeight;
              spriteCtx.drawImage(
                img,
                sourceX, sourceY, gridWidth, gridHeight,
                0, 0, gridWidth, gridHeight
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
    img.src = selectedImage.src;
  }, [imageLoaded, sliceSettings, zoomLevel, panOffset, selectedImage]);

  const loadSavedDefinitions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/assets/slice-definitions');
      const data = await response.json();
      if (data.success) {
        setSavedDefinitions(data.definitions);
        // Check if there's a saved definition for this image
        const existingDefinition = data.definitions.find((def: SliceDefinition) => def.imagePath === selectedImage?.src);
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

  const saveDefinition = async () => {
    if (!selectedImage) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/assets/slice-definitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagePath: selectedImage.src,
          imageName: selectedImage.name,
          ...sliceSettings
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSaveMessage('Definition saved successfully!');
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

  const handleZoom = (delta: number) => {
    const zoomFactor = 0.1;
    const newZoom = Math.max(0.1, Math.min(5, zoomLevel + delta * zoomFactor));
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">Sprite Editor</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings and Saved Definitions */}
          <div className="lg:col-span-1 space-y-6">
            {selectedImage ? (
              <>
                {/* Slice Settings */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Slice Settings</h2>
                  <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={saveDefinition}
                      disabled={isSaving || slicedSprites.length === 0}
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

                {/* Saved Definitions */}
                {savedDefinitions.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Saved Definitions</h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
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
              </>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold text-white mb-2">Select an Image to Edit</h2>
                <p className="text-gray-400">Choose an image from the asset browser to start slicing sprites</p>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            {selectedImage ? (
              <div className="bg-gray-800 rounded-lg p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Preview</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleZoom(1)}
                      className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded"
                    >
                      -
                    </button>
                    <span className="text-sm text-gray-300 min-w-[3rem] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => handleZoom(-1)}
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
                
                <div className="bg-gray-900 rounded p-4 overflow-auto" style={{ maxHeight: '600px' }}>
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
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Use zoom buttons to zoom • Click and drag to pan
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center h-full flex items-center justify-center">
                <div>
                  <div className="text-6xl mb-4">🎨</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Select an Image to Edit</h2>
                  <p className="text-gray-400">Choose an image from the asset browser to start slicing sprites</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
