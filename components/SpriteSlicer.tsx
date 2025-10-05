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
      
      const availableWidth = img.width - offsetX;
      const availableHeight = img.height - offsetY;
      
      const cols = Math.floor((availableWidth + spacingX) / (gridWidth + spacingX));
      const rows = Math.floor((availableHeight + spacingY) / (gridHeight + spacingY));
      
      // Set canvas size to show all sprites
      const canvasWidth = cols * (gridWidth + 4); // 4px padding between sprites
      const canvasHeight = rows * (gridHeight + 4);
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw grid lines
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= cols; i++) {
        const x = i * (gridWidth + 4);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
      
      for (let i = 0; i <= rows; i++) {
        const y = i * (gridHeight + 4);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
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
            
            // Draw sprite
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
    };
    img.src = imageSrc;
  }, [imageLoaded, sliceSettings]);

  const handleSettingChange = (key: keyof SliceSettings, value: number) => {
    setSliceSettings(prev => ({
      ...prev,
      [key]: Math.max(0, value)
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Controls Panel */}
          <div className="w-80 p-6 border-r border-gray-700 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Sprite Slicer</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grid Width
                </label>
                <input
                  type="number"
                  value={sliceSettings.gridWidth}
                  onChange={(e) => handleSettingChange('gridWidth', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grid Height
                </label>
                <input
                  type="number"
                  value={sliceSettings.gridHeight}
                  onChange={(e) => handleSettingChange('gridHeight', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  min="1"
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
                onClick={downloadAllSprites}
                disabled={slicedSprites.length === 0}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
              >
                Download All Sprites ({slicedSprites.length})
              </button>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Preview</h3>
              <div className="bg-gray-900 rounded p-4 overflow-auto">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-600"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
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
