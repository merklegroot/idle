'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface MapTile {
  type: 'g' | 'p'
  x: number
  y: number
}

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
  'path-top-left': { src: '/sliced-tiles/path/tl.png', offsetX: 0, offsetY: 0 },
  'path-top': { src: '/sliced-tiles/path/tm.png', offsetX: 0, offsetY: 0 },
  'path-top-right': { src: '/sliced-tiles/path/tr.png', offsetX: 0, offsetY: 0 },
  'path-left': { src: '/sliced-tiles/path/ml.png', offsetX: 0, offsetY: 0 },
  'path-right': { src: '/sliced-tiles/path/mr.png', offsetX: 0, offsetY: 0 },
  'path-bottom-left': { src: '/sliced-tiles/path/bl.png', offsetX: 0, offsetY: 0 },
  'path-bottom': { src: '/sliced-tiles/path/bm.png', offsetX: 0, offsetY: 0 },
  'path-bottom-right': { src: '/sliced-tiles/path/br.png', offsetX: 0, offsetY: 0 },
}

// Function to determine tile variant based on neighbors
function getTileVariant(tile: MapTile, mapData: MapTile[], maxX: number, maxY: number): string {
  if (tile.type === 'g') {
    return 'grass'
  }

  // For path tiles, determine the appropriate transition tile based on neighbors
  const neighbors = {
    top: getTileAt(tile.x, tile.y - 1, mapData),
    bottom: getTileAt(tile.x, tile.y + 1, mapData),
    left: getTileAt(tile.x - 1, tile.y, mapData),
    right: getTileAt(tile.x + 1, tile.y, mapData),
    topLeft: getTileAt(tile.x - 1, tile.y - 1, mapData),
    topRight: getTileAt(tile.x + 1, tile.y - 1, mapData),
    bottomLeft: getTileAt(tile.x - 1, tile.y + 1, mapData),
    bottomRight: getTileAt(tile.x + 1, tile.y + 1, mapData),
  }

  // Check if all 8 neighbors are path tiles (pure path)
  const allNeighborsArePath = Object.values(neighbors).every(neighbor => neighbor?.type === 'p')
  if (allNeighborsArePath) {
    return 'path'
  }

  // Determine transition tile based on which sides have grass neighbors
  // Note: null neighbors (outside map bounds) are treated as grass for edge transitions
  const hasGrassTop = neighbors.top?.type === 'g' || neighbors.top === null
  const hasGrassBottom = neighbors.bottom?.type === 'g' || neighbors.bottom === null
  const hasGrassLeft = neighbors.left?.type === 'g' || neighbors.left === null
  const hasGrassRight = neighbors.right?.type === 'g' || neighbors.right === null

  // Corner transitions (check both direct neighbors and diagonal neighbors)
  const hasGrassTopLeft = neighbors.topLeft?.type === 'g' || neighbors.topLeft === null
  const hasGrassTopRight = neighbors.topRight?.type === 'g' || neighbors.topRight === null
  const hasGrassBottomLeft = neighbors.bottomLeft?.type === 'g' || neighbors.bottomLeft === null
  const hasGrassBottomRight = neighbors.bottomRight?.type === 'g' || neighbors.bottomRight === null

  // Corner transitions - check both the direct neighbors and diagonal neighbors
  if (hasGrassTop && hasGrassLeft && hasGrassTopLeft) return 'path-top-left'
  if (hasGrassTop && hasGrassRight && hasGrassTopRight) return 'path-top-right'
  if (hasGrassBottom && hasGrassLeft && hasGrassBottomLeft) return 'path-bottom-left'
  if (hasGrassBottom && hasGrassRight && hasGrassBottomRight) return 'path-bottom-right'

  // Edge transitions
  if (hasGrassTop) return 'path-top'
  if (hasGrassBottom) return 'path-bottom'
  if (hasGrassLeft) return 'path-left'
  if (hasGrassRight) return 'path-right'

  // Default to center path tile
  return 'path'
}

// Helper function to get tile at specific coordinates
function getTileAt(x: number, y: number, mapData: MapTile[]): MapTile | null {
  return mapData.find(tile => tile.x === x && tile.y === y) || null
}

// Function to map tile variants to their mnemonics
function getTileVariantMnemonic(variant: string): string {
  switch (variant) {
    case 'grass':
      return 'g'
    case 'path':
      return 'p'
    case 'path-top-left':
      return 'tl'
    case 'path-top':
      return 'tm'
    case 'path-top-right':
      return 'tr'
    case 'path-left':
      return 'ml'
    case 'path-right':
      return 'mr'
    case 'path-bottom-left':
      return 'bl'
    case 'path-bottom':
      return 'bm'
    case 'path-bottom-right':
      return 'br'
    default:
      return '?'
  }
}

// Function to get 3x3 grid of mnemonics for path tiles
function getPathTile3x3Grid(variant: string, tile: MapTile, mapData: MapTile[], maxX: number, maxY: number): string[][] {
  // Get neighboring tiles
  const neighbors = {
    top: getTileAt(tile.x, tile.y - 1, mapData),
    bottom: getTileAt(tile.x, tile.y + 1, mapData),
    left: getTileAt(tile.x - 1, tile.y, mapData),
    right: getTileAt(tile.x + 1, tile.y, mapData),
    topLeft: getTileAt(tile.x - 1, tile.y - 1, mapData),
    topRight: getTileAt(tile.x + 1, tile.y - 1, mapData),
    bottomLeft: getTileAt(tile.x - 1, tile.y + 1, mapData),
    bottomRight: getTileAt(tile.x + 1, tile.y + 1, mapData),
  }

  // Start with all path tiles
  const grid = [
    ['p', 'p', 'p'],
    ['p', 'p', 'p'],
    ['p', 'p', 'p']
  ]
  
  // For each sub-tile, determine the appropriate mnemonic based on neighbors
  // Top row
  grid[0][0] = (neighbors.top?.type === 'g' || neighbors.top === null || neighbors.left?.type === 'g' || neighbors.left === null || neighbors.topLeft?.type === 'g' || neighbors.topLeft === null) ? 'tl' : 'p'
  grid[0][1] = (neighbors.top?.type === 'g' || neighbors.top === null) ? 'tm' : 'p'
  grid[0][2] = (neighbors.top?.type === 'g' || neighbors.top === null || neighbors.right?.type === 'g' || neighbors.right === null || neighbors.topRight?.type === 'g' || neighbors.topRight === null) ? 'tr' : 'p'
  
  // Middle row
  grid[1][0] = (neighbors.left?.type === 'g' || neighbors.left === null) ? 'ml' : 'p'
  grid[1][1] = 'm' // Center is always middle path
  grid[1][2] = (neighbors.right?.type === 'g' || neighbors.right === null) ? 'mr' : 'p'
  
  // Bottom row
  grid[2][0] = (neighbors.bottom?.type === 'g' || neighbors.bottom === null || neighbors.left?.type === 'g' || neighbors.left === null || neighbors.bottomLeft?.type === 'g' || neighbors.bottomLeft === null) ? 'bl' : 'p'
  grid[2][1] = (neighbors.bottom?.type === 'g' || neighbors.bottom === null) ? 'bm' : 'p'
  grid[2][2] = (neighbors.bottom?.type === 'g' || neighbors.bottom === null || neighbors.right?.type === 'g' || neighbors.right === null || neighbors.bottomRight?.type === 'g' || neighbors.bottomRight === null) ? 'br' : 'p'
  
  return grid
}

export default function MapPage() {
  const [mapData, setMapData] = useState<MapTile[]>([])
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
        setMapData(data)
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
            const variant = getTileVariant(tile, mapData, maxX, maxY)
            const tileVariant = TILE_VARIANTS[variant]
            
            // Debug logging for bottom row
            if (tile.y === 3 && tile.type === 'p') {
              const neighbors = {
                top: getTileAt(tile.x, tile.y - 1, mapData),
                bottom: getTileAt(tile.x, tile.y + 1, mapData),
                left: getTileAt(tile.x - 1, tile.y, mapData),
                right: getTileAt(tile.x + 1, tile.y, mapData),
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
                ) : (
                  <div 
                    className="relative overflow-hidden"
                    style={{ width: tileSize, height: tileSize }}
                  >
                    <Image
                      src={tileVariant.src}
                      alt="Path"
                      width={tileSize}
                      height={tileSize}
                      className="block"
                    />
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
                        {getPathTile3x3Grid(variant, tile, mapData, maxX, maxY).map((row, rowIndex) =>
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
          <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
                <span>g - Grass</span>
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
