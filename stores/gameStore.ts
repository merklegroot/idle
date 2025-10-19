import { create } from 'zustand';
import { GameStore } from './gameStoreModels';
import { getResourceFactory, setResourceAmountFactory, addResourceAmountFactory, setResourcePerSecondFactory, setResourceWorkersFactory, setResourcePaidWorkersFactory, setResourceWorkerCostFactory, setResourceWorkerSalaryFactory, setResourceIsGatheringFactory, setResourceGatherProgressFactory, setResourceWorkerProgressFactory } from './gameStoreFactory';
import { getHomeCostFactory, getHomeUpgradeCostFactory, canBuildHomeFactory, canUpgradeHomeFactory, buildHomeFactory, upgradeHomeFactory } from './gameStoreFactory';
import { bootstrapFactory, hireWorkerFactory, startGatheringFactory, resetGatherProgressFactory, resetWorkerProgressFactory, initializeResourceFactory, sellResourceFactory, sellResourcePercentageFactory, sellAllResourceFactory, setAutoSellThresholdFactory, setAutoSellEnabledFactory, checkAutoSellFactory, payWorkerSalariesFactory, equipToolFactory, unequipToolFactory, getEquippedToolFactory, getToolBonusFactory, getWorkerToolBonusFactory, getWorkersWithToolsFactory, startGameLoopFactory, stopGameLoopFactory, getPlayerStatsFactory, setPlayerStatsFactory, updatePlayerWarmthFactory, drinkWaterFactory, getTimeOfDayFactory, getDayFactory, setTimeOfDayFactory, setDayFactory, advanceTimeFactory, getCraftingRecipesFactory, canCraftRecipeFactory, craftRecipeFactory, unlockRecipeFactory } from './gameStoreFactory';
import { gameTickFactory } from './gameTickFactory';

const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  resources: {},
  gameLoopInterval: undefined,
  tickCount: 0,
  characterEquipment: {},
  homes: [],
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
  setResourceWorkers: setResourceWorkersFactory(set),
  setResourcePaidWorkers: setResourcePaidWorkersFactory(set),
  setResourceWorkerCost: setResourceWorkerCostFactory(set),
  setResourceWorkerSalary: setResourceWorkerSalaryFactory(set),
  setResourceIsGathering: setResourceIsGatheringFactory(set),
  setResourceGatherProgress: setResourceGatherProgressFactory(set),
  setResourceWorkerProgress: setResourceWorkerProgressFactory(set),

  // Home management
  buildHome: buildHomeFactory(set, get),
  upgradeHome: upgradeHomeFactory(set, get),
  getHomeCost: getHomeCostFactory(get),
  getHomeUpgradeCost: getHomeUpgradeCostFactory(get),
  canBuildHome: canBuildHomeFactory(get),
  canUpgradeHome: canUpgradeHomeFactory(get),

  // Bootstrap
  bootstrap: bootstrapFactory(set, get),

  // Actions
  hireWorker: hireWorkerFactory(set, get),

  startGathering: startGatheringFactory(set, get),
  resetGatherProgress: resetGatherProgressFactory(set),
  resetWorkerProgress: resetWorkerProgressFactory(set),

  // Initialize resource
  initializeResource: initializeResourceFactory(set, get),

  // Selling functions
  sellResource: sellResourceFactory(set, get),
  sellResourcePercentage: sellResourcePercentageFactory(get),
  sellAllResource: sellAllResourceFactory(get),

  // Auto-sell functions
  setAutoSellThreshold: setAutoSellThresholdFactory(set),
  setAutoSellEnabled: setAutoSellEnabledFactory(set),
  checkAutoSell: checkAutoSellFactory(get),

  // Salary system
  payWorkerSalaries: payWorkerSalariesFactory(set, get),

  // Equipment management
  equipTool: equipToolFactory(set, get),
  unequipTool: unequipToolFactory(set, get),
  getEquippedTool: getEquippedToolFactory(get),
  getToolBonus: getToolBonusFactory(get),
  getWorkerToolBonus: getWorkerToolBonusFactory(get),
  getWorkersWithTools: getWorkersWithToolsFactory(get),

  // Game loop
  startGameLoop: startGameLoopFactory(set, get),
  stopGameLoop: stopGameLoopFactory(set, get),
  gameTick: gameTickFactory(set, get),

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
