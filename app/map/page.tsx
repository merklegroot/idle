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

// Tile mapping for the 3x3 Path_Tile.png grid
// The Path_Tile.png contains a 3x3 grid of tiles in a single image
// Each sub-tile is 32x32 pixels, so the full sprite sheet is 96x96 pixels
const TILE_VARIANTS: { [key: string]: TileVariant } = {
  // Pure grass tile
  'grass': {
    src: '/assets/cute-fantasy-rpg/Tiles/Grass_Middle.png',
    offsetX: 0,
    offsetY: 0
  },
  // Pure path tile (center of 3x3 grid)
  'path': {
    src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png',
    offsetX: 1,
    offsetY: 1
  },
  // Transition tiles from Path_Tile.png 3x3 grid
  'path-top-left': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 0, offsetY: 0 },
  'path-top': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 1, offsetY: 0 },
  'path-top-right': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 2, offsetY: 0 },
  'path-left': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 0, offsetY: 1 },
  'path-right': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 2, offsetY: 1 },
  'path-bottom-left': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 0, offsetY: 2 },
  'path-bottom': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 1, offsetY: 2 },
  'path-bottom-right': { src: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', offsetX: 2, offsetY: 2 },
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

export default function MapPage() {
  const [mapData, setMapData] = useState<MapTile[]>([])
  const [loading, setLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [showGrid, setShowGrid] = useState(false)

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch('/data/town-map.txt')
        const text = await response.text()
        
        const lines = text.trim().split('\n')
        const tiles: MapTile[] = []
        
        lines.forEach((line, y) => {
          line.split('').forEach((char, x) => {
            if (char === 'g' || char === 'p') {
              tiles.push({
                type: char as 'g' | 'p',
                x,
                y
              })
            }
          })
        })
        
        setMapData(tiles)
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
  const tileSize = 32 // Size of each tile in pixels

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
                  <Image
                    src={tileVariant.src}
                    alt="Grass"
                    width={tileSize}
                    height={tileSize}
                    className="block"
                  />
                ) : (
                  <div 
                    className="relative overflow-hidden"
                    style={{ width: tileSize, height: tileSize }}
                  >
                    <Image
                      src={tileVariant.src}
                      alt="Path"
                      width={96} // 3 * 32 = 96 pixels for the full sprite sheet
                      height={96}
                      className="absolute"
                      style={{
                        left: -tileVariant.offsetX * tileSize,
                        top: -tileVariant.offsetY * tileSize,
                        width: 96,
                        height: 96
                      }}
                    />
                    {debugMode && (
                      <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-[8px] p-0.5 pointer-events-none leading-none">
                        {variant}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          
          {/* Grid overlay - placed after tiles so it renders on top */}
          {showGrid && (
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
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Map size: {maxX + 1} × {maxY + 1} tiles</p>
        <p>Legend: 🟢 Grass (g) | 🟤 Path with smooth transitions (p)</p>
        <p className="text-xs text-gray-500 mt-1">
          Path tiles automatically blend with grass using 3x3 transition tiles
        </p>
      </div>
    </div>
  )
}
