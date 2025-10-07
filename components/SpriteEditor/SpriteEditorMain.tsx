'use client';

import { useState, useEffect, useRef } from 'react';
import SliceSettingsControls from '@/components/SpriteEditor/SliceSettingsControls';
import SavedDefinitionsList from '@/components/SpriteEditor/SavedDefinitionsList';
import PreviewControls from '@/components/SpriteEditor/PreviewControls';
import SpriteCanvas from '@/components/SpriteEditor/SpriteCanvas';

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

interface SpriteEditorMainProps {
  selectedImage: { src: string; name: string } | null;
}

export default function SpriteEditorMain({ selectedImage }: SpriteEditorMainProps) {
  const [sliceSettings, setSliceSettings] = useState<SliceSettings>({
    gridWidth: 32,
    gridHeight: 32,
    offsetX: 0,
    offsetY: 0,
    spacingX: 0,
    spacingY: 0,
    description: '',
    type: 'Unknown'
  });
  const [slicedSprites, setSlicedSprites] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [savedDefinitions, setSavedDefinitions] = useState<SliceDefinition[]>([]);
  const [currentDefinition, setCurrentDefinition] = useState<SliceDefinition | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasSlicingParams, setHasSlicingParams] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load definitions
  useEffect(() => {
    loadSavedDefinitions();
  }, [selectedImage]);

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
    
    // Disable image smoothing for pixel art
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // If no slicing parameters, show the full image
      if (!hasSlicingParams) {
        // Set canvas size to actual pixel dimensions for crisp rendering
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Clear canvas
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, img.width, img.height);
        
        // Draw the full image
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        
        // Store the full image as a single sprite
        const spriteCanvas = document.createElement('canvas');
        const spriteCtx = spriteCanvas.getContext('2d');
        if (spriteCtx) {
          spriteCanvas.width = img.width;
          spriteCanvas.height = img.height;
          spriteCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
          setSlicedSprites([spriteCanvas.toDataURL()]);
        } else {
          setSlicedSprites([]);
        }
        
        // Restore context after drawing
        ctx.restore();
        return;
      }
      
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
      
      // Set canvas size to actual pixel dimensions for crisp rendering
      // Use the actual image dimensions to ensure we show the complete image
      const baseCanvasWidth = Math.max(cols * (gridWidth + 4), img.width + 4);
      const baseCanvasHeight = Math.max(rows * (gridHeight + 4), img.height + 4);
      
      canvas.width = baseCanvasWidth;
      canvas.height = baseCanvasHeight;
      
      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, baseCanvasWidth, baseCanvasHeight);
      
      // Draw grid lines (using base dimensions)
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      // Draw vertical grid lines
      for (let i = 0; i <= cols; i++) {
        const x = i * (gridWidth + 4);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, baseCanvasHeight);
        ctx.stroke();
      }
      
      // Draw horizontal grid lines
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
      
      // Draw additional grid lines to cover the full image area
      for (let i = cols + 1; i <= maxCols; i++) {
        const x = i * (gridWidth + 4);
        if (x <= baseCanvasWidth) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, baseCanvasHeight);
          ctx.stroke();
        }
      }
      
      for (let i = rows + 1; i <= maxRows; i++) {
        const y = i * (gridHeight + 4);
        if (y <= baseCanvasHeight) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(baseCanvasWidth, y);
          ctx.stroke();
        }
      }
      
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
            
            // Add visual indicator for partial tiles
            if (actualWidth < gridWidth || actualHeight < gridHeight) {
              // Draw a semi-transparent overlay only on the empty remainder area
              ctx.fillStyle = 'rgba(255, 165, 0, 0.4)'; // Orange with 40% opacity
              
              // Highlight the empty area to the right if width is partial
              if (actualWidth < gridWidth) {
                ctx.fillRect(destX + actualWidth, destY, gridWidth - actualWidth, actualHeight);
              }
              
              // Highlight the empty area below if height is partial
              if (actualHeight < gridHeight) {
                ctx.fillRect(destX, destY + actualHeight, gridWidth, gridHeight - actualHeight);
              }
            }
            
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
    };
    img.src = selectedImage!.src;
  }, [imageLoaded, sliceSettings, zoomLevel, panOffset, selectedImage, hasSlicingParams]);

  const loadSavedDefinitions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/assets/slice-definitions');
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response (load):', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error (load):', jsonError);
        const responseText = await response.text();
        console.error('Response Text (load):', responseText);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.success) {
        setSavedDefinitions(data.definitions || []);
        // Find the definition for the current image
        const existingDefinition = selectedImage?.src 
          ? data.definitions.find((def: SliceDefinition) => def.imagePath === selectedImage.src)
          : null;
        setCurrentDefinition(existingDefinition || null);
        
        if (existingDefinition) {
          setSliceSettings({
            gridWidth: existingDefinition.gridWidth,
            gridHeight: existingDefinition.gridHeight,
            offsetX: existingDefinition.offsetX,
            offsetY: existingDefinition.offsetY,
            spacingX: existingDefinition.spacingX,
            spacingY: existingDefinition.spacingY,
            description: existingDefinition.description || '',
            type: existingDefinition.type || 'Unknown'
          });
          // Check if this definition has slicing parameters and type allows slicing
          const typeAllowsSlicing = existingDefinition.type === 'Tile Sheet' || existingDefinition.type === 'Sprite Sheet';
          setHasSlicingParams(typeAllowsSlicing && existingDefinition.gridWidth > 0 && existingDefinition.gridHeight > 0);
        } else {
          setHasSlicingParams(false);
        }
      }
    } catch (error) {
      console.error('Error loading definitions:', error);
      // Set empty array as fallback
      setSavedDefinitions([]);
      setCurrentDefinition(null);
      setHasSlicingParams(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: keyof SliceSettings, value: number | string) => {
    // Handle string values (like description)
    if (typeof value === 'string') {
      setSliceSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      // If type is changed to Unknown or Image, disable slicing
      if (key === 'type' && (value === 'Unknown' || value === 'Image')) {
        setHasSlicingParams(false);
        setSliceSettings(prev => ({
          ...prev,
          gridWidth: 32,
          gridHeight: 32,
          offsetX: 0,
          offsetY: 0,
          spacingX: 0,
          spacingY: 0
        }));
      }
      return;
    }
    
    // Handle number values with validation
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
          imageWidth: imageDimensions.width,
          imageHeight: imageDimensions.height,
          hasSlicingParams,
          ...sliceSettings
        })
      });
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        const responseText = await response.text();
        console.error('Response Text:', responseText);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.success) {
        setSaveMessage('Definition saved successfully!');
        try {
          await loadSavedDefinitions();
        } catch (loadError) {
          console.error('Error reloading definitions after save:', loadError);
          // Don't show this error to user since save was successful
        }
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
      spacingY: definition.spacingY,
      description: definition.description || '',
      type: definition.type || 'Unknown'
    });
    // Check if this definition has slicing parameters and type allows slicing
    const typeAllowsSlicing = definition.type === 'Tile Sheet' || definition.type === 'Sprite Sheet';
    setHasSlicingParams(typeAllowsSlicing && definition.gridWidth > 0 && definition.gridHeight > 0);
  };

  const deleteDefinition = async (definitionId: string) => {
    try {
      const response = await fetch(`/api/assets/slice-definitions?id=${definitionId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentDefinition(null);
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

  const toggleSlicing = () => {
    if (hasSlicingParams) {
      // Remove slicing - reset to default values
      setSliceSettings(prev => ({
        ...prev,
        gridWidth: 32,
        gridHeight: 32,
        offsetX: 0,
        offsetY: 0,
        spacingX: 0,
        spacingY: 0
      }));
    } else {
      // Add slicing - keep current values or use defaults
      setSliceSettings(prev => ({
        ...prev,
        gridWidth: prev.gridWidth || 32,
        gridHeight: prev.gridHeight || 32,
        offsetX: prev.offsetX || 0,
        offsetY: prev.offsetY || 0,
        spacingX: prev.spacingX || 0,
        spacingY: prev.spacingY || 0
      }));
    }
    setHasSlicingParams(!hasSlicingParams);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold !text-white drop-shadow-lg">Sprite Editor</h1>
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
                <SliceSettingsControls
                  sliceSettings={sliceSettings}
                  onSettingChange={handleSettingChange}
                  onSave={saveDefinition}
                  isSaving={isSaving}
                  saveMessage={saveMessage}
                  slicedSpritesCount={slicedSprites.length}
                  hasSlicingParams={hasSlicingParams}
                  onToggleSlicing={toggleSlicing}
                />

                {/* Saved Definition */}
                <SavedDefinitionsList
                  definition={currentDefinition}
                  onLoadDefinition={loadDefinition}
                  onDeleteDefinition={deleteDefinition}
                />
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
                  <PreviewControls
                    zoomLevel={zoomLevel}
                    onZoom={handleZoom}
                    onResetView={resetView}
                  />
                </div>
                
                <SpriteCanvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  zoomLevel={zoomLevel}
                  panOffset={panOffset}
                />
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
