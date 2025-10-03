import { create } from 'zustand';
import { GameStore } from './gameStoreModels';
import { getResourceFactory, setResourceAmountFactory, addResourceAmountFactory, setResourcePerSecondFactory, setResourceWorkersFactory, setResourcePaidWorkersFactory, setResourceWorkerCostFactory, setResourceWorkerSalaryFactory, setResourceIsGatheringFactory, setResourceGatherProgressFactory, setResourceWorkerProgressFactory } from './gameStoreFactory';
import { getHomeCostFactory, getHomeUpgradeCostFactory, canBuildHomeFactory, canUpgradeHomeFactory, buildHomeFactory, upgradeHomeFactory } from './gameStoreFactory';
import { bootstrapFactory, hireWorkerFactory, startGatheringFactory, resetGatherProgressFactory, resetWorkerProgressFactory, initializeResourceFactory, sellResourceFactory, sellResourcePercentageFactory, sellAllResourceFactory, setAutoSellThresholdFactory, setAutoSellEnabledFactory, checkAutoSellFactory, payWorkerSalariesFactory, equipToolFactory, unequipToolFactory, getEquippedToolFactory, getToolBonusFactory, getWorkerToolBonusFactory, getWorkersWithToolsFactory, startGameLoopFactory, stopGameLoopFactory } from './gameStoreFactory';
import { gameTickFactory } from './gameTickFactory';

const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  resources: {},
  gameLoopInterval: undefined,
  tickCount: 0,
  characterEquipment: {},
  homes: [],

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
  gameTick: gameTickFactory(set, get)
}));

export default useGameStore;
