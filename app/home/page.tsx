'use client'

import { useState, useEffect, useRef } from 'react';
import type { MapTile } from '@/models/MapTile';
import type { SceneryTileMap } from '@/models/SceneryTileMap';
import MapComponent from '@/components/MapComponent';
import SelectedTileComponent from '@/components/SelectedTileComponent';
import CompactStatsBar from '@/components/CompactStatsBar';
import CompactDayNightCycle from '@/components/CompactDayNightCycle';
import useGameStore from '@/stores/gameStore';
import GatheringProgressDisplay, { GatheringProgressProps } from '@/components/GatheringProgressDisplay';
import MapLegend from '@/components/MapLegend';
import InventoryWidget from '@/components/Inventory/InventoryWidget';
import CraftingPanel from '@/components/Crafting/CraftingPanel';
import DebugControls from '@/components/DebugControls';
import { TerrainEnum } from '@/models/TerrainEnum';
import { CRAFTING_RECIPES, CraftingRecipeId } from '@/constants/CraftingRecipeDefs';
import { ActionCategory, ActionId } from '@/constants/ActionDefs';
import { resourceUtil } from '@/utils/resourceUtil';
import { ALL_GATHER_ACTION_DEFS, GatherDefs } from '@/constants/GatherDefs';

export default function MapPage() {
  const { addResourceQuantity, initializeResource, getResource, drinkWater, bootstrap, canCraftRecipe, craftRecipe } = useGameStore();
  const [mapData, setMapData] = useState<MapTile[]>([]);
  const [treeData, setTreeData] = useState<SceneryTileMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [shouldShowGrid, setShouldShowGrid] = useState(false);
  const [shouldShowTileLetters, setShouldShowTileLetters] = useState(false);
  const [shouldShowTileVariants, setShouldShowTileVariants] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);
  const [gatheringProgress, setGatheringProgress] = useState<GatheringProgressProps | undefined>();
  const [isCraftingModalOpen, setIsCraftingModalOpen] = useState(false);
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
    };

    loadMapData();
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading map...</div>
      </div>
    );
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

  function startGathering(actionId: ActionId) {
    // For crafting actions, allow starting without a selected tile
    
    const actionCategory = resourceUtil.getActionCategory(actionId);
    if (!selectedTile && actionCategory === ActionCategory.Crafting) return;

    // Reset completion flag
    completionHandled.current = false;

    // Start gathering progress
    setGatheringProgress({
      isActive: true,
      progress: 0,
      tile: selectedTile || { x: 0, y: 0 },
      actionId: actionId
    });

    // Simulate gathering progress over 3 seconds
    const interval = setInterval(() => {
      setGatheringProgress((prev: GatheringProgressProps | undefined) => {
        if (!prev) return undefined;

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
    startGathering(GatherDefs.Stick.id);
  }

  function handleGatherStone() {
    startGathering(GatherDefs.Stone.id);
  }

  function handleGatherThatch() {
    startGathering(GatherDefs.Thatch.id);
  }

  function handleDrinkWater() {
    startGathering(GatherDefs.Water.id);
  }

  function handleGatherBerry() {
    startGathering(GatherDefs.Berry.id);
  }

  function handleGatheringCompletion(prev: {
    actionId: ActionId
    tile: { x: number; y: number };
  }) {
    const actionCategory = resourceUtil.getActionCategory(prev.actionId);
    if (actionCategory === ActionCategory.Gathering) {
      const gatherAction = ALL_GATHER_ACTION_DEFS.find(g => g.id === prev.actionId);
      if (gatherAction) {
        addResourceQuantity(gatherAction.resultingResourceId, 1);
      }
    }

    if (actionCategory === ActionCategory.Crafting) {
      const craftingRecipe = CRAFTING_RECIPES.find(r => r.id === prev.actionId);
      if (craftingRecipe) {
        craftRecipe(craftingRecipe.id);
      }
    }

    setGatheringProgress(undefined);
  }

  function onStartCrafting(recipeId: CraftingRecipeId) {
   if (!canCraftRecipe(recipeId)) return;
   startGathering(recipeId);
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
          <div className="flex items-center gap-4">
            <InventoryWidget />
            <button
              onClick={() => setIsCraftingModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Crafting
            </button>
          </div>

          {/* Selected Tile Panel */}
          {selectedTile && (
            <div className="flex-1">
              <SelectedTileComponent
                selectedTile={selectedTile}
                terrainType={selectedMapTile?.terrainType}
                containsTree={selectedTreeTile?.sceneryType === 'tree'}
                containsStone={selectedTreeTile?.sceneryType === 'rock'}
                containsThatch={containsThatch || false}
                containsWater={selectedMapTile?.terrainType === TerrainEnum.Water || false}
                hasLeanTo={selectedMapTile?.hasLeanTo || false}
                foliageType={selectedTreeTile ? selectedTreeTile.sceneryType : null}
                onGatherStick={handleGatherStick}
                onGatherStone={handleGatherStone}
                onGatherThatch={handleGatherThatch}
                onDrinkWater={handleDrinkWater}
                onGatherBerry={handleGatherBerry}
                onClose={() => handleTileSelect(null, null)}
                isGathering={gatheringProgress?.isActive || false}
              />
            </div>
          )}
        </div>
      </div>

      <MapLegend maxX={maxX} maxY={maxY} />

      <CraftingPanel 
        isOpen={isCraftingModalOpen}
        onClose={() => setIsCraftingModalOpen(false)}
        onStartCrafting={onStartCrafting} 
      />
    </div>
  );
}
