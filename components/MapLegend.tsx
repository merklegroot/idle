'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MapLegendProps {
  maxX: number
  maxY: number
}

export default function MapLegend({ maxX, maxY }: MapLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6 text-sm text-gray-600">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 px-4 py-2 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
      >
        {isExpanded ? '▼ Legend' : '▶ Legend'}
      </button>
      {isExpanded && (
        <>
          <p className="mb-4">
            <span className="font-medium">Map size:</span> {maxX + 1} × {maxY + 1} tiles
          </p>
          <div className="mt-2">
            <p className="font-semibold mb-2">Legend:</p>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="font-medium mb-1">Grass Tiles:</p>
            <div className="flex items-center gap-2">
              <div className="relative" style={{ width: '32px', height: '32px' }}>
                <Image
                  src="/assets/cute-fantasy-rpg/Tiles/Grass_Middle.png"
                  alt="Grass"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
              <span>g - Grass</span>
            </div>
          </div>
          <div>
            <p className="font-medium mb-1">Housing Plots:</p>
            <div className="flex items-center gap-2">
              <div className="relative" style={{ width: '32px', height: '32px' }}>
                <Image
                  src="/assets/cute-fantasy-rpg/Tiles/FarmLand_Tile.png"
                  alt="Housing Plot"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
              <span>l - Housing Plot</span>
            </div>
          </div>
          <div>
            <p className="font-medium mb-1">Trees:</p>
            <div className="flex items-center gap-2">
              <div className="relative" style={{ width: '32px', height: '32px' }}>
                <Image
                  src="/assets/cute-fantasy-rpg/Outdoor decoration/Oak_Tree.png"
                  alt="Tree"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
              <span>t - Tree</span>
            </div>
          </div>
          <div>
            <p className="font-medium mb-1">Path Tiles:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/m.png"
                  alt="Path"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>p - Pure path</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/tl.png"
                  alt="Path Top Left"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>tl - Top left</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/tm.png"
                  alt="Path Top"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>tm - Top middle</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/tr.png"
                  alt="Path Top Right"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>tr - Top right</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/ml.png"
                  alt="Path Left"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>ml - Middle left</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/mr.png"
                  alt="Path Right"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>mr - Middle right</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/bl.png"
                  alt="Path Bottom Left"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>bl - Bottom left</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/bm.png"
                  alt="Path Bottom"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>bm - Bottom middle</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sliced-tiles/path/br.png"
                  alt="Path Bottom Right"
                  width={32}
                  height={32}
                  className="block"
                  style={{
                    imageRendering: 'pixelated'
                  }}
                />
                <span>br - Bottom right</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
