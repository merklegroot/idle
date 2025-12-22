'use client'

import { useState, useEffect, useRef } from 'react'
import type { MapTile } from '@/models/MapTile'
import type { SceneryTileMap } from '@/models/SceneryTileMap'
import MapComponent from '@/components/MapComponent'
import SelectedTileComponent from '@/components/SelectedTileComponent'
import CompactStatsBar from '@/components/CompactStatsBar'
import CompactDayNightCycle from '@/components/CompactDayNightCycle'
import useGameStore from '@/stores/gameStore'
import GatheringProgressDisplay from '@/components/GatheringProgressDisplay'
import MapLegend from '@/components/MapLegend'
import InventoryWidget from '@/components/Inventory/InventoryWidget'
import CraftingPanel from '@/components/Crafting/CraftingPanel'
import DebugControls from '@/components/DebugControls'
import { TerrainEnum } from '@/models/TerrainEnum'
import { FoliageEnum } from '@/models/FoliageEnum'

export default function MapPage() {
  const { addResourceQuantity, initializeResource, getResource, drinkWater, bootstrap, canCraftRecipe, craftRecipe } = useGameStore()
  const [mapData, setMapData] = useState<MapTile[]>([]);
  const [treeData, setTreeData] = useState<SceneryTileMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [shouldShowGrid, setShouldShowGrid] = useState(false);
  const [shouldShowTileLetters, setShouldShowTileLetters] = useState(false);
  const [shouldShowTileVariants, setShouldShowTileVariants] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);
  const [gatheringProgress, setGatheringProgress] = useState<{
    isActive: boolean;
    progress: number;
    tile: { x: number; y: number };
    resourceType: 'stick' | 'stone' | 'thatch' | 'water' | 'berry' | 'construct-lean-to' | 'craft-twine' | 'craft-knapped-axe-head' | 'craft-tool-handle-recipe' | 'craft-flimsy-axe-recipe';
  } | null>(null);
  const completionHandled = useRef(false);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch('/api/map-data');
        const data = await response.json();
        setMapData(data.tiles);
        setTreeData(data.treeTiles);
      } catch (error) {
        console.error('Failed to load map data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMapData();
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading map...</div>
      </div>
    )
  }

  // Calculate map dimensions for legend
  const maxX = Math.max(...mapData.map(tile => tile.x));
  const maxY = Math.max(...mapData.map(tile => tile.y));

  // Calculate selected tile information
  const selectedMapTile = selectedTile
    ? mapData.find(tile => tile.x === selectedTile.x && tile.y === selectedTile.y)
    : null;

  const selectedTreeTile = selectedTile
    ? treeData.find(tree => tree.x === selectedTile.x && tree.y === selectedTile.y)
    : null;

  // Check if selected tile contains thatch (grass tiles)
  const containsThatch = selectedTile && selectedMapTile?.terrainType === TerrainEnum.Grass;

  function handleTileSelect(x: number | null, y: number | null) {
    if (x === null || y === null) {
      setSelectedTile(null);
      return;
    }
    setSelectedTile({ x, y });
  }

  function startGathering(resourceType: 'stick' | 'stone' | 'thatch' | 'water' | 'berry' | 'construct-lean-to' | 'craft-twine' | 'craft-knapped-axe-head' | 'craft-tool-handle-recipe' | 'craft-flimsy-axe-recipe') {
    // For crafting actions, allow starting without a selected tile
    const isCraftAction = resourceType === 'craft-twine' || resourceType === 'craft-knapped-axe-head' || resourceType === 'craft-tool-handle-recipe' || resourceType === 'craft-flimsy-axe-recipe';
    if (!selectedTile && !isCraftAction) return;

    // Handle construction resource check
    if (resourceType === 'construct-lean-to') {
      const stickResource = getResource('stick');
      if (!stickResource || stickResource.quantity < 1) {
        alert('You need at least 1 stick to construct a lean-to!');
        return;
      }
    }

    // Handle crafting recipe checks
    if (resourceType === 'craft-twine' && !canCraftRecipe('twine')) {
      return;
    }
    if (resourceType === 'craft-knapped-axe-head' && !canCraftRecipe('knapped-axe-head')) {
      return;
    }
    if (resourceType === 'craft-tool-handle-recipe' && !canCraftRecipe('tool-handle-recipe')) {
      return;
    }
    if (resourceType === 'craft-flimsy-axe-recipe' && !canCraftRecipe('flimsy-axe-recipe')) {
      return;
    }

    // Initialize resource if it doesn't exist (for non-crafting actions)
    if (!isCraftAction && resourceType !== 'construct-lean-to') {
      const resourceKey = resourceType === 'berry' ? 'berries' : resourceType;
      if (!getResource(resourceKey)) {
        initializeResource(resourceKey);
      }
    }

    // Reset completion flag
    completionHandled.current = false;

    // Start gathering progress
    setGatheringProgress({
      isActive: true,
      progress: 0,
      tile: selectedTile || { x: 0, y: 0 },
      resourceType
    });

    // Simulate gathering progress over 3 seconds
    const interval = setInterval(() => {
      setGatheringProgress(prev => {
        if (!prev) return null;

        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);

          // Only handle completion once
          if (!completionHandled.current) {
            completionHandled.current = true;
            setTimeout(() => {
              handleGatheringCompletion(prev);
            }, 500);
          }

          return {
            ...prev,
            progress: 100
          };
        }

        return {
          ...prev,
          progress: newProgress
        };
      });
    }, 300);
  }

  function handleGatherStick() {
    startGathering('stick');
  }

  function handleGatherStone() {
    startGathering('stone');
  }

  function handleGatherThatch() {
    startGathering('thatch');
  }

  function handleDrinkWater() {
    startGathering('water');
  }

  function handleGatherBerry() {
    startGathering('berry');
  }

  function handleConstructLeanTo() {
    startGathering('construct-lean-to');
  }

  function handleCraftTwine() {
    if (!canCraftRecipe('twine')) {
      alert('You need at least 1 thatch to craft twine!');
      return;
    }
    startGathering('craft-twine');
  }

  // Check if player can construct a lean-to (has at least 1 stick)
  function canConstructLeanTo() {
    const stickResource = getResource('stick');
    return stickResource && stickResource.quantity >= 1;
  }

  // Check if player can craft twine (has at least 1 thatch)
  function canCraftTwine() {
    return canCraftRecipe('twine');
  }

  function handleGatheringCompletion(prev: {
    resourceType: 'stick' | 'stone' | 'thatch' | 'water' | 'berry' | 'construct-lean-to' | 'craft-twine' | 'craft-knapped-axe-head' | 'craft-tool-handle-recipe' | 'craft-flimsy-axe-recipe';
    tile: { x: number; y: number };
  }) {
    // Add resource to inventory after delay
    if (prev.resourceType === 'stone') {
      addResourceQuantity('stone', 1);
    }

    if (prev.resourceType === 'stick') {
      addResourceQuantity('stick', 1);
    }

    if (prev.resourceType === 'thatch') {
      addResourceQuantity('thatch', 1);
    }

    if (prev.resourceType === 'water') {
      drinkWater();
    }

    if (prev.resourceType === 'berry') {
      addResourceQuantity('berries', 1);
    }

    if (prev.resourceType === 'construct-lean-to') {
      // Deduct the cost and show success message
      addResourceQuantity('stick', -1);
      
      // Mark the tile as having a lean-to
      setMapData(prevMapData => 
        prevMapData.map(tile => 
          tile.x === prev.tile.x && tile.y === prev.tile.y
            ? { ...tile, hasLeanTo: true }
            : tile
        )
      );
      
      alert('Lean-to constructed successfully!');
    }

    if (prev.resourceType === 'craft-twine') {
      // Craft twine using the crafting system
      craftRecipe('twine');
    }

    if (prev.resourceType === 'craft-knapped-axe-head') {
      // Craft knapped axe head using the crafting system
      craftRecipe('knapped-axe-head');
    }

    if (prev.resourceType === 'craft-tool-handle-recipe') {
      // Craft tool handle using the crafting system
      craftRecipe('tool-handle-recipe');
    }

    if (prev.resourceType === 'craft-flimsy-axe-recipe') {
      // Craft flimsy axe using the crafting system
      craftRecipe('flimsy-axe-recipe');
    }

    setGatheringProgress(null);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-800">Town Map</h1>
          <CompactDayNightCycle />
          <div className="flex items-center gap-4 ml-4">
            <CompactStatsBar />
            <div className="w-60 sm:w-80">
              <GatheringProgressDisplay gatheringProgress={gatheringProgress} />
            </div>
          </div>
        </div>
        <DebugControls
          shouldShowGrid={shouldShowGrid}
          setShouldShowGrid={setShouldShowGrid}
          shouldShowTileLetters={shouldShowTileLetters}
          setShouldShowTileLetters={setShouldShowTileLetters}
          shouldShowTileVariants={shouldShowTileVariants}
          setShouldShowTileVariants={setShouldShowTileVariants}
          isDebugMode={isDebugMode}
          setIsDebugMode={setIsDebugMode}
          hasSelectedTile={!!selectedTile}
          onClearSelection={() => setSelectedTile(null)}
        />
      </div>

      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <MapComponent
            mapData={mapData}
            treeData={treeData}
            shouldShowGrid={shouldShowGrid}
            shouldShowTileLetters={shouldShowTileLetters}
            shouldShowTileVariants={shouldShowTileVariants}
            isDebugMode={isDebugMode}
            selectedTile={selectedTile}
            onTileSelect={handleTileSelect}
          />
        </div>

        {/* Info Panels */}
        <div className="flex-1 min-w-0 space-y-4">          
          <InventoryWidget />
          
          {/* Selected Tile and Crafting Panels - Side by Side */}
          <div className="flex gap-4">
            {selectedTile && (
              <div className="flex-1">
                <SelectedTileComponent
                  selectedTile={selectedTile}
                  terrainType={selectedMapTile?.terrainType || null}
                  containsTree={selectedTreeTile?.sceneryType === FoliageEnum.Tree || false}
                  containsStone={selectedTreeTile?.sceneryType === FoliageEnum.Rock || false}
                  containsThatch={containsThatch || false}
                  containsWater={selectedMapTile?.terrainType === TerrainEnum.Water || false}
                  hasLeanTo={selectedMapTile?.hasLeanTo || false}
                  foliageType={selectedTreeTile ? selectedTreeTile.sceneryType : null}
                  onGatherStick={handleGatherStick}
                  onGatherStone={handleGatherStone}
                  onGatherThatch={handleGatherThatch}
                  onDrinkWater={handleDrinkWater}
                  onGatherBerry={handleGatherBerry}
                  onConstructLeanTo={handleConstructLeanTo}
                  onClose={() => handleTileSelect(null, null)}
                  isGathering={gatheringProgress?.isActive || false}
                  canConstructLeanTo={canConstructLeanTo()}
                />
              </div>
            )}
            
            <div className="flex-1">
              <CraftingPanel onStartCrafting={(recipeId) => {
                if (recipeId === 'twine') {
                  handleCraftTwine()
                  return
                }
                if (recipeId === 'knapped-axe-head') {
                  // Route through gathering progress like twine
                  if (!canCraftRecipe('knapped-axe-head')) return
                  startGathering('craft-knapped-axe-head')
                  return
                }
                if (recipeId === 'tool-handle-recipe') {
                  // Route through gathering progress like twine
                  if (!canCraftRecipe('tool-handle-recipe')) return
                  startGathering('craft-tool-handle-recipe')
                  return
                }
                if (recipeId === 'flimsy-axe-recipe') {
                  // Route through gathering progress like twine
                  if (!canCraftRecipe('flimsy-axe-recipe')) return
                  startGathering('craft-flimsy-axe-recipe')
                  return
                }
              }} />
            </div>
          </div>
        </div>
      </div>

      <MapLegend maxX={maxX} maxY={maxY} />
    </div>
  )
}
