'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { MapTile } from '@/models/MapTile'
import type { SceneryTileMap } from '@/models/SceneryTileMap'
import { pathUtil } from '@/utils/pathUtil'
import { TerrainEnum } from '@/models/TerrainEnum'
import { SceneryEnum } from '@/models/SceneryEnum'
import useGameStore from '@/stores/gameStore'

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
  // Water tile
  'water': {
    src: '/assets/cute-fantasy-rpg/Tiles/Water_Middle.png',
    offsetX: 0,
    offsetY: 0
  },
  // Berry bush tile
  'berry-bush': {
    src: '/assets/cute-fantasy-rpg/Outdoor decoration/Oak_Tree_Small.png',
    offsetX: 0,
    offsetY: 0
  },
}

// Function to determine tile variant based on neighbors
function getTileVariant(tile: MapTile, mapData: MapTile[]): string {
  if (tile.terrainType === TerrainEnum.Grass) {
    return 'grass'
  }

  if (tile.terrainType === TerrainEnum.HousingPlot) {
    return 'housing'
  }

  if (tile.terrainType === TerrainEnum.Water) {
    return 'water'
  }

  // For path tiles, always use the 3x3 grid approach
  return 'path-3x3-grid'
}

// Helper function to check if there's a tree at specific coordinates
function hasTreeAt(x: number, y: number, treeData: SceneryTileMap[]): boolean {
  return treeData.some(tree => tree.x === x && tree.y === y && tree.sceneryType === SceneryEnum.Tree)
}

// Helper function to check if there's a stone at specific coordinates
function hasStoneAt(x: number, y: number, treeData: SceneryTileMap[]): boolean {
  return treeData.some(tree => tree.x === x && tree.y === y && tree.sceneryType === SceneryEnum.Rock)
}

// Helper function to check if there's a berry bush at specific coordinates
function hasBerryBushAt(x: number, y: number, treeData: SceneryTileMap[]): boolean {
  return treeData.some(tree => tree.x === x && tree.y === y && tree.sceneryType === SceneryEnum.BerryBush)
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
  const [drawingOffset, setDrawingOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const img = document.createElement('img')
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = src
  }, [src])

  // Fetch drawing offset from sprite definitions
  useEffect(() => {
    const fetchDrawingOffset = async () => {
      try {
        const response = await fetch('/api/assets/slice-definitions')
        const data = await response.json()

        if (data.success && data.definitions) {
          // Find the definition for this image
          const definition = data.definitions.find((def: any) => def.imagePath === src)
          if (definition) {
            setDrawingOffset({
              x: definition.drawingOffsetX ?? 0,
              y: definition.drawingOffsetY ?? 0
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch sprite definitions:', error)
      }
    }

    fetchDrawingOffset()
  }, [src])

  const calculatedOffset = imageDimensions
    ? calculateVerticalOffset(imageDimensions.width, imageDimensions.height, tileSize)
    : 0

  const totalOffset = calculatedOffset + drawingOffset.y

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
        transform: `translate(${drawingOffset.x}px, ${totalOffset}px)`
      }}
    />
  )
}

interface MapComponentProps {
  mapData: MapTile[]
  treeData: SceneryTileMap[]
  shouldShowGrid: boolean
  shouldShowTileLetters: boolean
  shouldShowTileVariants: boolean
  isDebugMode: boolean
  selectedTile?: { x: number; y: number } | null
  onTileSelect?: (x: number | null, y: number | null) => void
}

export default function MapComponent({
  mapData,
  treeData,
  shouldShowGrid,
  shouldShowTileLetters,
  shouldShowTileVariants,
  isDebugMode,
  selectedTile,
  onTileSelect
}: MapComponentProps) {
  const { getTimeOfDay } = useGameStore()
  const timeOfDay = getTimeOfDay()

  // Calculate map dimensions
  const maxX = Math.max(...mapData.map(tile => tile.x))
  const maxY = Math.max(...mapData.map(tile => tile.y))
  const tileSize = 64 // Size of each tile in pixels (doubled from 32)

  // Track hovered tile
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null)

  // Calculate brightness based on time of day (sine wave)
  const getBrightness = (hours: number) => {
    const radians = (hours / 24) * 2 * Math.PI - Math.PI / 2
    const sineValue = Math.sin(radians)
    // Convert sine value (-1 to 1) to brightness (0.3 to 1.0)
    // 0.3 = dim but visible, 1.0 = full brightness
    return (sineValue + 1) / 2 * 0.7 + 0.3
  }

  const brightness = getBrightness(timeOfDay)

  return (
    <div 
      className="bg-gray-100 p-4 rounded-lg inline-block"
      style={{
        filter: `brightness(${brightness})`
      }}
    >
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
          if (tile.y === 3 && tile.terrainType === TerrainEnum.Path) {
            const neighbors = {
              top: pathUtil.getTileAt(tile.x, tile.y - 1, mapData),
              bottom: pathUtil.getTileAt(tile.x, tile.y + 1, mapData),
              left: pathUtil.getTileAt(tile.x - 1, tile.y, mapData),
              right: pathUtil.getTileAt(tile.x + 1, tile.y, mapData),
            }
          }

          const isSelected = selectedTile?.x === tile.x && selectedTile?.y === tile.y
          const isHovered = hoveredTile?.x === tile.x && hoveredTile?.y === tile.y

          return (
            <div
              key={`${tile.x}-${tile.y}`}
              className="relative cursor-pointer transition-all duration-200"
              style={{
                gridColumn: tile.x + 1,
                gridRow: tile.y + 1
              }}
              onClick={() => {
                if (isSelected) {
                  onTileSelect?.(null, null) // Unselect if already selected
                } else {
                  onTileSelect?.(tile.x, tile.y) // Select if not selected
                }
              }}
              onMouseEnter={() => setHoveredTile({ x: tile.x, y: tile.y })}
              onMouseLeave={() => setHoveredTile(null)}
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
                  {shouldShowTileLetters && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: `${tileSize * 0.8}px` }}
                    >
                      <span className="text-white font-bold drop-shadow-lg">g</span>
                    </div>
                  )}
                  {shouldShowTileVariants && (
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
                  {shouldShowTileLetters && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: `${tileSize * 0.8}px` }}
                    >
                      <span className="text-white font-bold drop-shadow-lg">l</span>
                    </div>
                  )}
                  {shouldShowTileVariants && (
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
                  {isDebugMode && (
                    <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-[8px] p-0.5 pointer-events-none leading-none">
                      {variant}
                    </div>
                  )}
                  {shouldShowTileLetters && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: `${tileSize * 0.8}px` }}
                    >
                      <span className="text-white font-bold drop-shadow-lg">p</span>
                    </div>
                  )}
                  {shouldShowTileVariants && (
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
                  {shouldShowTileLetters && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: `${tileSize * 0.6}px` }}
                    >
                      <span className="text-green-800 font-bold drop-shadow-lg">T</span>
                    </div>
                  )}
                </div>
              )}

              {/* Stone overlay */}
              {hasStoneAt(tile.x, tile.y, treeData) && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="flex items-center justify-center"
                    style={{ fontSize: `${tileSize * 0.6}px` }}
                  >
                    <span className="text-gray-600 font-bold drop-shadow-lg">🪨</span>
                  </div>
                  {shouldShowTileLetters && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: `${tileSize * 0.6}px` }}
                    >
                      <span className="text-gray-600 font-bold drop-shadow-lg">S</span>
                    </div>
                  )}
                </div>
              )}

              {/* Berry bush overlay */}
              {hasBerryBushAt(tile.x, tile.y, treeData) && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="flex items-center justify-center"
                    style={{ fontSize: `${tileSize * 0.6}px` }}
                  >
                    <span className="text-red-600 font-bold drop-shadow-lg">🫐</span>
                  </div>
                  {shouldShowTileLetters && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: `${tileSize * 0.6}px` }}
                    >
                      <span className="text-red-600 font-bold drop-shadow-lg">B</span>
                    </div>
                  )}
                </div>
              )}

              {/* Lean-to overlay */}
              {tile.hasLeanTo && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="flex items-center justify-center"
                    style={{ fontSize: `${tileSize * 0.6}px` }}
                  >
                    <span className="text-amber-600 font-bold drop-shadow-lg">🏕️</span>
                  </div>
                  {shouldShowTileLetters && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: `${tileSize * 0.6}px` }}
                    >
                      <span className="text-amber-600 font-bold drop-shadow-lg">L</span>
                    </div>
                  )}
                </div>
              )}

              {/* Selection overlay */}
              {isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-dashed border-yellow-500"></div>
                </div>
              )}

              {/* Hover overlay */}
              {isHovered && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-1 border-2 border-dashed border-blue-400"></div>
                </div>
              )}
            </div>
          )
        })}

        {/* Grid overlay - placed after tiles so it renders on top */}
        {shouldShowGrid && (
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
  )
}
