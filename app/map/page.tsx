'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { MapTile } from '@/models/MapTile'
import type { TreeMapTile } from '@/models/TreeMapTile'
import MapComponent from '@/components/MapComponent'

export default function MapPage() {
  const [mapData, setMapData] = useState<MapTile[]>([])
  const [treeData, setTreeData] = useState<TreeMapTile[]>([])
  const [loading, setLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [shouldShowGrid, setShouldShowGrid] = useState(false)
  const [shouldShowTileLetters, setShouldShowTileLetters] = useState(false)
  const [shouldShowTileVariants, setShouldShowTileVariants] = useState(false)

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Town Map</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShouldShowGrid(!shouldShowGrid)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              shouldShowGrid 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {shouldShowGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          <button
            onClick={() => setShouldShowTileLetters(!shouldShowTileLetters)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              shouldShowTileLetters 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {shouldShowTileLetters ? 'Hide Letters' : 'Show Letters'}
          </button>
          <button
            onClick={() => setShouldShowTileVariants(!shouldShowTileVariants)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              shouldShowTileVariants 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {shouldShowTileVariants ? 'Hide Variants' : 'Show Variants'}
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
      
      <MapComponent
        mapData={mapData}
        treeData={treeData}
        shouldShowGrid={shouldShowGrid}
        shouldShowTileLetters={shouldShowTileLetters}
        shouldShowTileVariants={shouldShowTileVariants}
        isDebugMode={debugMode}
      />
      
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
