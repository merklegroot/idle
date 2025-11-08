import { create } from 'zustand';
import { GameStore } from './gameStoreModels';
import { getResourceFactory, setResourceAmountFactory, addResourceAmountFactory, setResourcePerSecondFactory, setResourceIsGatheringFactory, setResourceGatherProgressFactory } from './gameStoreFactory';
import { bootstrapFactory, startGatheringFactory, resetGatherProgressFactory, initializeResourceFactory, getPlayerStatsFactory, setPlayerStatsFactory, updatePlayerWarmthFactory, drinkWaterFactory, getTimeOfDayFactory, getDayFactory, setTimeOfDayFactory, setDayFactory, advanceTimeFactory, getCraftingRecipesFactory, canCraftRecipeFactory, craftRecipeFactory, unlockRecipeFactory } from './gameStoreFactory';

const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  resources: {},
  playerStats: {
    health: 100,
    warmth: 50,
    food: 80,
    hydration: 70
  },
  timeOfDay: 12, // Start at noon
  day: 1,
  craftingRecipes: [],

  // Resource management
  getResource: getResourceFactory(get),
  setResourceAmount: setResourceAmountFactory(set),
  addResourceAmount: addResourceAmountFactory(set),
  setResourcePerSecond: setResourcePerSecondFactory(set),
  setResourceIsGathering: setResourceIsGatheringFactory(set),
  setResourceGatherProgress: setResourceGatherProgressFactory(set),

  // Bootstrap
  bootstrap: bootstrapFactory(set, get),

  startGathering: startGatheringFactory(set, get),
  resetGatherProgress: resetGatherProgressFactory(set),

  // Initialize resource
  initializeResource: initializeResourceFactory(set, get),

  // Player stats management
  getPlayerStats: getPlayerStatsFactory(get),
  setPlayerStats: setPlayerStatsFactory(set),
  updatePlayerWarmth: updatePlayerWarmthFactory(set, get),
  drinkWater: drinkWaterFactory(set, get),

  // Time management
  getTimeOfDay: getTimeOfDayFactory(get),
  getDay: getDayFactory(get),
  setTimeOfDay: setTimeOfDayFactory(set),
  setDay: setDayFactory(set),
  advanceTime: advanceTimeFactory(set, get),

  // Crafting management
  getCraftingRecipes: getCraftingRecipesFactory(get),
  canCraftRecipe: canCraftRecipeFactory(get),
  craftRecipe: craftRecipeFactory(set, get),
  unlockRecipe: unlockRecipeFactory(set)
}));

export default useGameStore;
