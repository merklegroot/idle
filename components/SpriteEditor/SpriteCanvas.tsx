import { forwardRef } from 'react';

interface SpriteCanvasProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  zoomLevel?: number;
  panOffset?: { x: number; y: number };
}

const SpriteCanvas = forwardRef<HTMLCanvasElement, SpriteCanvasProps>(
  ({ onMouseDown, onMouseMove, onMouseUp, zoomLevel = 1, panOffset = { x: 0, y: 0 } }, ref) => {
    return (
      <div className="bg-gray-900 rounded p-4 overflow-auto" style={{ maxHeight: '600px' }}>
        <canvas
          ref={ref}
          className="border border-gray-600 cursor-grab active:cursor-grabbing"
          style={{ 
            maxWidth: 'none', 
            height: 'auto',
            minWidth: '100%',
            imageRendering: 'pixelated',
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'top left'
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
        <div className="text-xs text-gray-400 mt-2">
          Use zoom buttons to zoom • Click and drag to pan
        </div>
      </div>
    );
  }
);

SpriteCanvas.displayName = 'SpriteCanvas';

export default SpriteCanvas;
