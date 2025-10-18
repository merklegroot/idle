'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { MapTile } from '@/models/MapTile'
import type { SceneryTileMap } from '@/models/SceneryTileMap'
import MapComponent from '@/components/MapComponent'
import SelectedTileComponent from '@/components/SelectedTileComponent'
import CompactStatsBar from '@/components/CompactStatsBar'
import CompactDayNightCycle from '@/components/CompactDayNightCycle'
import useGameStore from '@/stores/gameStore'
import GatherProgressComponent from '@/components/GatherProgressComponent'
import { TerrainEnum } from '@/models/TerrainEnum'
import { SceneryEnum } from '@/models/SceneryEnum'

export default function MapPage() {
  const { addResourceAmount, initializeResource, getResource, drinkWater } = useGameStore()
  const [mapData, setMapData] = useState<MapTile[]>([])
  const [treeData, setTreeData] = useState<SceneryTileMap[]>([])
  const [loading, setLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [shouldShowGrid, setShouldShowGrid] = useState(false)
  const [shouldShowTileLetters, setShouldShowTileLetters] = useState(false)
  const [shouldShowTileVariants, setShouldShowTileVariants] = useState(false)
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null)
  const [gatheringProgress, setGatheringProgress] = useState<{
    isActive: boolean
    progress: number
    tile: { x: number; y: number }
    resourceType: 'stick' | 'stone' | 'thatch' | 'water'
  } | null>(null)
  const completionHandled = useRef(false)

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

  // Calculate map dimensions for legend
  const maxX = Math.max(...mapData.map(tile => tile.x))
  const maxY = Math.max(...mapData.map(tile => tile.y))

  // Calculate selected tile information
  const selectedMapTile = selectedTile
    ? mapData.find(tile => tile.x === selectedTile.x && tile.y === selectedTile.y)
    : null

  const selectedTreeTile = selectedTile
    ? treeData.find(tree => tree.x === selectedTile.x && tree.y === selectedTile.y)
    : null

  // Check if selected tile contains thatch (grass tiles)
  const containsThatch = selectedTile && selectedMapTile?.terrainType === TerrainEnum.Grass;

  const handleTileSelect = (x: number | null, y: number | null) => {
    if (x === null || y === null) {
      setSelectedTile(null)
    } else {
      setSelectedTile({ x, y })
    }
  }

  const startGathering = (resourceType: 'stick' | 'stone' | 'thatch' | 'water') => {
    if (!selectedTile) return

    // Initialize resource if it doesn't exist
    if (!getResource(resourceType)) {
      initializeResource(resourceType)
    }

    // Reset completion flag
    completionHandled.current = false

    // Start gathering progress
    setGatheringProgress({
      isActive: true,
      progress: 0,
      tile: selectedTile,
      resourceType
    })

    // Simulate gathering progress over 3 seconds
    const interval = setInterval(() => {
      setGatheringProgress(prev => {
        if (!prev) return null

        const newProgress = prev.progress + 10
        if (newProgress >= 100) {
          clearInterval(interval)

          // Only handle completion once
          if (!completionHandled.current) {
            completionHandled.current = true
            setTimeout(() => {
              // Add resource to inventory after delay
              if (prev.resourceType === 'stone') {
                addResourceAmount('stone', 1);
              }

              if (prev.resourceType === 'stick') {
                addResourceAmount('stick', 1);
              }

              if (prev.resourceType === 'thatch') {
                addResourceAmount('thatch', 1);
              }

              if (prev.resourceType === 'water') {
                drinkWater();
              }

              setGatheringProgress(null)
            }, 500)
          }

          return {
            ...prev,
            progress: 100
          }
        }

        return {
          ...prev,
          progress: newProgress
        }
      })
    }, 300)
  }

  const handleGatherStick = () => {
    startGathering('stick')
  }

  const handleGatherStone = () => {
    startGathering('stone')
  }

  const handleGatherThatch = () => {
    startGathering('thatch')
  }

  const handleDrinkWater = () => {
    startGathering('water')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-800">Town Map</h1>
          <CompactDayNightCycle />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShouldShowGrid(!shouldShowGrid)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${shouldShowGrid
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
          >
            {shouldShowGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          <button
            onClick={() => setShouldShowTileLetters(!shouldShowTileLetters)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${shouldShowTileLetters
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
          >
            {shouldShowTileLetters ? 'Hide Letters' : 'Show Letters'}
          </button>
          <button
            onClick={() => setShouldShowTileVariants(!shouldShowTileVariants)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${shouldShowTileVariants
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
          >
            {shouldShowTileVariants ? 'Hide Variants' : 'Show Variants'}
          </button>
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${debugMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
          >
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </button>
          {selectedTile && (
            <button
              onClick={() => setSelectedTile(null)}
              className="px-4 py-2 rounded-lg font-semibold transition-colors text-sm bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Gathering Progress Display */}
      {gatheringProgress && (
        <div className={`mb-4 p-4 rounded-lg ${gatheringProgress.resourceType === 'stick'
            ? 'bg-green-50 border border-green-200'
            : gatheringProgress.resourceType === 'thatch'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
          <div className="flex items-center justify-between mb-2">
            <GatherProgressComponent gatheringProgress={gatheringProgress} />
            <span className={`text-sm font-medium ${gatheringProgress.resourceType === 'stick'
                ? 'text-green-600'
                : gatheringProgress.resourceType === 'thatch'
                  ? 'text-yellow-600'
                  : 'text-gray-600'
              }`}>
              {gatheringProgress.progress}%
            </span>
          </div>
          <div className={`w-full rounded-full h-3 ${gatheringProgress.resourceType === 'stick'
              ? 'bg-green-200'
              : gatheringProgress.resourceType === 'thatch'
                ? 'bg-yellow-200'
                : 'bg-gray-200'
            }`}>
            <div
              className={`h-3 rounded-full transition-all duration-300 ease-out ${gatheringProgress.resourceType === 'stick'
                  ? 'bg-green-600'
                  : gatheringProgress.resourceType === 'thatch'
                    ? 'bg-yellow-600'
                    : 'bg-gray-600'
                }`}
              style={{ width: `${gatheringProgress.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Map Component */}
        <div className="flex-shrink-0">
          <MapComponent
            mapData={mapData}
            treeData={treeData}
            shouldShowGrid={shouldShowGrid}
            shouldShowTileLetters={shouldShowTileLetters}
            shouldShowTileVariants={shouldShowTileVariants}
            isDebugMode={debugMode}
            selectedTile={selectedTile}
            onTileSelect={handleTileSelect}
          />
        </div>

        {/* Info Panels */}
        <div className="flex-1 min-w-0 space-y-4">
          <CompactStatsBar />

          {selectedTile && (
            <SelectedTileComponent
              selectedTile={selectedTile}
              terrainType={selectedMapTile?.terrainType || null}
              containsTree={selectedTreeTile?.sceneryType === SceneryEnum.Tree || false}
              containsStone={selectedTreeTile?.sceneryType === SceneryEnum.Rock || false}
              containsThatch={containsThatch || false}
              containsWater={selectedMapTile?.terrainType === TerrainEnum.Water || false}
              onGatherStick={handleGatherStick}
              onGatherStone={handleGatherStone}
              onGatherThatch={handleGatherThatch}
              onDrinkWater={handleDrinkWater}
              onClose={() => handleTileSelect(null, null)}
              isGathering={gatheringProgress?.isActive || false}
            />
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
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
      </div>
    </div>
  )
}
