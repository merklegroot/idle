'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { MapTile } from '@/models/MapTile'
import type { TreeMapTile } from '@/models/TreeMapTile'
import { pathUtil } from '@/utils/pathUtil'

interface TileVariant {
  src: string
  offsetX: number
  offsetY: number
}

// Tile mapping using individual sliced PNG files
const TILE_VARIANTS: { [key: string]: TileVariant } = {
  // Pure grass tile
  'grass': {
    src: '/assets/cute-fantasy-rpg/Tiles/Grass_Middle.png',
    offsetX: 0,
    offsetY: 0
  },
  // Path tiles using individual sliced files
  'path': {
    src: '/sliced-tiles/path/m.png',
    offsetX: 0,
    offsetY: 0
  },
  // Center path tile surrounded by grass - use the original path tile
  'path-center-grass': {
    src: '/assets/cute-fantasy-rpg/Tiles/Path_Middle.png',
    offsetX: 0,
    offsetY: 0
  },
  'path-top-left': { src: '/sliced-tiles/path/tl.png', offsetX: 0, offsetY: 0 },
  'path-top': { src: '/sliced-tiles/path/tm.png', offsetX: 0, offsetY: 0 },
  'path-top-right': { src: '/sliced-tiles/path/tr.png', offsetX: 0, offsetY: 0 },
  'path-left': { src: '/sliced-tiles/path/ml.png', offsetX: 0, offsetY: 0 },
  'path-right': { src: '/sliced-tiles/path/mr.png', offsetX: 0, offsetY: 0 },
  'path-bottom-left': { src: '/sliced-tiles/path/bl.png', offsetX: 0, offsetY: 0 },
  'path-bottom': { src: '/sliced-tiles/path/bm.png', offsetX: 0, offsetY: 0 },
  'path-bottom-right': { src: '/sliced-tiles/path/br.png', offsetX: 0, offsetY: 0 },
  // Housing plot tile
  'housing': {
    src: '/assets/cute-fantasy-rpg/Tiles/FarmLand_Tile.png',
    offsetX: 0,
    offsetY: 0
  },
  // Tree tile
  'tree': {
    src: '/assets/cute-fantasy-rpg/Outdoor decoration/Oak_Tree.png',
    offsetX: 0,
    offsetY: 0
  },
}

// Function to determine tile variant based on neighbors
function getTileVariant(tile: MapTile, mapData: MapTile[]): string {
  if (tile.type === 'g') {
    return 'grass'
  }
  
  if (tile.type === 'l') {
    return 'housing'
  }

  // For path tiles, always use the 3x3 grid approach
  return 'path-3x3-grid'
}

// Helper function to check if there's a tree at specific coordinates
function hasTreeAt(x: number, y: number, treeData: TreeMapTile[]): boolean {
  return treeData.some(tree => tree.x === x && tree.y === y && tree.type === 't')
}

// Helper function to calculate vertical offset for non-square images
function calculateVerticalOffset(imageWidth: number, imageHeight: number, tileSize: number): number {
  // If image is taller than it is wide, center it vertically
  if (imageHeight > imageWidth) {
    return -(imageHeight - tileSize) / 2
  }
  return 0
}

// Tree image component that handles dynamic sizing
function TreeImage({ src, alt, tileSize }: { src: string, alt: string, tileSize: number }) {
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null)
  
  useEffect(() => {
    const img = document.createElement('img')
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = src
  }, [src])
  
  const verticalOffset = imageDimensions 
    ? calculateVerticalOffset(imageDimensions.width, imageDimensions.height, tileSize)
    : 0
  
  return (
    <Image
      src={src}
      alt={alt}
      width={tileSize}
      height={tileSize}
      className="block"
      unoptimized
      style={{
        imageRendering: 'pixelated',
        transform: `translateY(${verticalOffset}px)`
      }}
    />
  )
}

export default function MapPage() {
  const [mapData, setMapData] = useState<MapTile[]>([])
  const [treeData, setTreeData] = useState<TreeMapTile[]>([])
  const [loading, setLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [showTileLetters, setShowTileLetters] = useState(false)
  const [showTileVariants, setShowTileVariants] = useState(false)

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch('/api/map-data')
        const data = await response.json()
        setMapData(data.tiles)
        setTreeData(data.treeTiles)
      } catch (error) {
        console.error('Failed to load map data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading map...</div>
      </div>
    )
  }

  // Calculate map dimensions
  const maxX = Math.max(...mapData.map(tile => tile.x))
  const maxY = Math.max(...mapData.map(tile => tile.y))
  const tileSize = 64 // Size of each tile in pixels (doubled from 32)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Town Map</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              showGrid 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          <button
            onClick={() => setShowTileLetters(!showTileLetters)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              showTileLetters 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {showTileLetters ? 'Hide Letters' : 'Show Letters'}
          </button>
          <button
            onClick={() => setShowTileVariants(!showTileVariants)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              showTileVariants 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {showTileVariants ? 'Hide Variants' : 'Show Variants'}
          </button>
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
            debugMode 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {debugMode ? 'Hide Debug' : 'Show Debug'}
        </button>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg inline-block">
        <div 
          className="grid gap-0 relative"
          style={{
            gridTemplateColumns: `repeat(${maxX + 1}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${maxY + 1}, ${tileSize}px)`
          }}
        >
          {mapData.map((tile, index) => {
            const variant = getTileVariant(tile, mapData)
            const tileVariant = TILE_VARIANTS[variant]
            
            // Debug logging for bottom row
            if (tile.y === 3 && tile.type === 'p') {
              const neighbors = {
                top: pathUtil.getTileAt(tile.x, tile.y - 1, mapData),
                bottom: pathUtil.getTileAt(tile.x, tile.y + 1, mapData),
                left: pathUtil.getTileAt(tile.x - 1, tile.y, mapData),
                right: pathUtil.getTileAt(tile.x + 1, tile.y, mapData),
              }
              console.log(`Tile at (${tile.x}, ${tile.y}): variant=${variant}`)
              console.log(`  Neighbors: top=${neighbors.top?.type || 'null'}, bottom=${neighbors.bottom?.type || 'null'}, left=${neighbors.left?.type || 'null'}, right=${neighbors.right?.type || 'null'}`)
            }
            
            return (
              <div
                key={`${tile.x}-${tile.y}`}
                className="relative"
                style={{
                  gridColumn: tile.x + 1,
                  gridRow: tile.y + 1
                }}
              >
                {variant === 'grass' ? (
                  <div className="relative">
                  <Image
                    src={tileVariant.src}
                    alt="Grass"
                    width={tileSize}
                    height={tileSize}
                    className="block"
                    unoptimized
                    style={{
                      imageRendering: 'pixelated'
                    }}
                  />
                    {showTileLetters && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ fontSize: `${tileSize * 0.8}px` }}
                      >
                        <span className="text-white font-bold drop-shadow-lg">g</span>
                      </div>
                    )}
                    {showTileVariants && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ fontSize: `${tileSize * 0.4}px` }}
                      >
                        <span className="text-yellow-300 font-bold drop-shadow-lg">g</span>
                      </div>
                    )}
                  </div>
                ) : variant === 'housing' ? (
                  <div className="relative">
                    <Image
                      src={tileVariant.src}
                      alt="Housing Plot"
                      width={tileSize}
                      height={tileSize}
                      className="block"
                      unoptimized
                      style={{
                        imageRendering: 'pixelated'
                      }}
                    />
                    {showTileLetters && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ fontSize: `${tileSize * 0.8}px` }}
                      >
                        <span className="text-white font-bold drop-shadow-lg">l</span>
                      </div>
                    )}
                    {showTileVariants && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ fontSize: `${tileSize * 0.4}px` }}
                      >
                        <span className="text-yellow-300 font-bold drop-shadow-lg">h</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="relative overflow-hidden"
                    style={{ width: tileSize, height: tileSize }}
                  >
                    {variant === 'path-3x3-grid' ? (
                      // Render composite 3x3 grid for all path tiles
                      <div 
                        className="absolute inset-0"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gridTemplateRows: '1fr 1fr 1fr',
                          gap: '0px'
                        }}
                      >
                        {pathUtil.getPathTile3x3Grid(tile, mapData).map((row, rowIndex) =>
                          row.map((cell, colIndex) => {
                            const subTileSrc = `/sliced-tiles/path/${cell}.png`;
                            return (
                              <Image
                                key={`${rowIndex}-${colIndex}`}
                                src={subTileSrc}
                                alt={`Path ${cell}`}
                                width={tileSize / 3}
                                height={tileSize / 3}
                                className="block"
                                unoptimized
                                style={{
                                  imageRendering: 'pixelated'
                                }}
                              />
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <Image
                        src={tileVariant.src}
                        alt="Path"
                        width={tileSize}
                        height={tileSize}
                        className="block"
                        unoptimized
                        style={{
                          imageRendering: 'pixelated'
                        }}
                      />
                    )}
                    {debugMode && (
                      <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-[8px] p-0.5 pointer-events-none leading-none">
                        {variant}
                      </div>
                    )}
                    {showTileLetters && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ fontSize: `${tileSize * 0.8}px` }}
                      >
                        <span className="text-white font-bold drop-shadow-lg">p</span>
                      </div>
                    )}
                    {showTileVariants && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ 
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gridTemplateRows: '1fr 1fr 1fr',
                          gap: '1px'
                        }}
                      >
                        {pathUtil.getPathTile3x3Grid(tile, mapData).map((row, rowIndex) =>
                          row.map((cell, colIndex) => (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              className="flex items-center justify-center"
                              style={{ fontSize: `${tileSize * 0.2}px` }}
                            >
                              <span className="text-yellow-300 font-bold drop-shadow-lg">{cell}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tree overlay */}
                {hasTreeAt(tile.x, tile.y, treeData) && (
                  <div className="absolute inset-0 pointer-events-none">
                    <TreeImage
                      src={TILE_VARIANTS['tree'].src}
                      alt="Tree"
                      tileSize={tileSize}
                    />
                    {showTileLetters && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ fontSize: `${tileSize * 0.6}px` }}
                      >
                        <span className="text-green-800 font-bold drop-shadow-lg">T</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          
          {/* Grid overlay - placed after tiles so it renders on top */}
          {showGrid && (
            <>
              {/* Main grid (tile boundaries) */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0, 0, 0, 0.8) 2px, transparent 2px),
                    linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 2px, transparent 2px)
                  `,
                  backgroundSize: `${tileSize}px ${tileSize}px`,
                  width: `${(maxX + 1) * tileSize}px`,
                  height: `${(maxY + 1) * tileSize}px`
                }}
              />
              
              {/* Sub-grid for split tiles (3x3 subdivisions within each tile) */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 0, 0, 0.6) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 0, 0, 0.6) 1px, transparent 1px)
                  `,
                  backgroundSize: `${tileSize / 3}px ${tileSize / 3}px`,
                  width: `${(maxX + 1) * tileSize}px`,
                  height: `${(maxY + 1) * tileSize}px`
                }}
              />
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Map size: {maxX + 1} × {maxY + 1} tiles</p>
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
      </div>
    </div>
  )
}
