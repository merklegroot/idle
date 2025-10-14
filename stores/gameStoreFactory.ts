import { WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef, ThatchDef, toolEffectiveness, toolBonuses, toolCategories } from '../app/models/ResourceDef';
import { GameState, GameStore, HomeCost, Home, PlayerStats } from './gameStoreModels';
import { gameStoreUtil } from './gameStoreUtil';

export function getResourceFactory(get: () => GameState) {
  return (resourceKey: string) => {
    return get().resources[resourceKey];
  }
}

export function setResourceAmountFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, amount: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], amount } }
    }));
  }
}

export function addResourceAmountFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, amount: number): void {
    set((state) => {
      const existingResource = state.resources[resourceKey];
      if (!existingResource) {
        // Initialize resource if it doesn't exist
        return {
          resources: {
            ...state.resources,
            [resourceKey]: {
              amount: amount,
              perSecond: 0,
              workers: 0,
              paidWorkers: 0,
              workerCost: 100,
              workerSalary: 10,
              isGathering: false,
              gatherProgress: 0,
              workerProgress: 0,
              autoSellThreshold: 0,
              autoSellEnabled: false
            }
          }
        };
      }
      
      return {
        resources: { 
          ...state.resources, 
          [resourceKey]: { 
            ...existingResource, 
            amount: existingResource.amount + amount 
          } 
        }
      };
    });
  }
}

export function setResourcePerSecondFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, perSecond: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], perSecond } }
    }));
  }
}

export function setResourceWorkersFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, workers: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], workers } }
    }));
  }
}

export function setResourcePaidWorkersFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, paidWorkers: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], paidWorkers } }
    }));
  }
}

export function setResourceWorkerCostFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, workerCost: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], workerCost } }
    }));
  }
}

export function setResourceWorkerSalaryFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, workerSalary: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], workerSalary } }
    }));
  }
}

export function setResourceIsGatheringFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, isGathering: boolean): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], isGathering } }
    }));
  }
}

export function setResourceGatherProgressFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, gatherProgress: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], gatherProgress } }
    }));
  }
}

export function setResourceWorkerProgressFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, workerProgress: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], workerProgress } }
    }));
  }
}

export function getHomeCostFactory(get: () => GameState) {
  return function (): HomeCost {
    const state = get();
    const homeCount = state.homes.length;

    // Base costs: 50 wood, 30 stone, 200 gold
    // Costs increase with each home built
    const multiplier = Math.pow(1.3, homeCount);

    return {
      wood: Math.floor(50 * multiplier),
      stone: Math.floor(30 * multiplier),
      gold: Math.floor(200 * multiplier)
    };
  }
}

export function canBuildHomeFactory(get: () => GameState) {
  return function (): boolean {
    const state = get();
    const cost = getHomeCostFactory(get)();

    const wood = state.resources.wood;
    const stone = state.resources.stone;
    const gold = state.resources.gold;

    return (
      wood && wood.amount >= cost.wood &&
      stone && stone.amount >= cost.stone &&
      gold && gold.amount >= cost.gold
    );
  }
}

export function getHomeUpgradeCostFactory(get: () => GameState) {
  return function (homeId: string) {
    const state = get();
    const home = state.homes.find(h => h.id === homeId);
    if (!home) return { wood: 0, stone: 0, gold: 0 };

    // Upgrade costs: 25 wood, 15 stone, 100 gold per level
    const multiplier = Math.pow(1.2, home.level);

    return {
      wood: Math.floor(25 * multiplier),
      stone: Math.floor(15 * multiplier),
      gold: Math.floor(100 * multiplier)
    };
  }
}

export function canUpgradeHomeFactory(get: () => GameState) {
  return function (homeId: string) {
    const state = get();
    const home = state.homes.find(h => h.id === homeId);
    if (!home) return false;

    const cost = getHomeUpgradeCostFactory(get)(homeId);

    const wood = state.resources.wood;
    const stone = state.resources.stone;
    const gold = state.resources.gold;

    return (
      wood && wood.amount >= cost.wood &&
      stone && stone.amount >= cost.stone &&
      gold && gold.amount >= cost.gold
    );
  }
}

export function buildHomeFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (): void {
    const state = get();
    const cost = getHomeCostFactory(get)();

    if (!canBuildHomeFactory(get)()) return;

    const newHome: Home = {
      id: `home-${Date.now()}`,
      level: 1,
      population: 2,
      happiness: 50
    };

    // Consume materials
    const updatedResources = { ...state.resources };
    updatedResources.wood = {
      ...updatedResources.wood,
      amount: updatedResources.wood.amount - cost.wood
    };
    updatedResources.stone = {
      ...updatedResources.stone,
      amount: updatedResources.stone.amount - cost.stone
    };
    updatedResources.gold = {
      ...updatedResources.gold,
      amount: updatedResources.gold.amount - cost.gold
    };

    set((state) => ({
      ...state,
      homes: [...state.homes, newHome],
      resources: updatedResources
    }));
  }
}

export function upgradeHomeFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (homeId: string) {
    const state = get();
    const home = state.homes.find(h => h.id === homeId);
    if (!home || !canUpgradeHomeFactory(get)(homeId)) return;

    const upgradeCost = getHomeUpgradeCostFactory(get)(homeId);

    // Consume materials
    const updatedResources = { ...state.resources };
    updatedResources.wood = {
      ...updatedResources.wood,
      amount: updatedResources.wood.amount - upgradeCost.wood
    };
    updatedResources.stone = {
      ...updatedResources.stone,
      amount: updatedResources.stone.amount - upgradeCost.stone
    };
    updatedResources.gold = {
      ...updatedResources.gold,
      amount: updatedResources.gold.amount - upgradeCost.gold
    };

    set((state) => ({
      ...state,
      homes: state.homes.map(h =>
        h.id === homeId
          ? {
            ...h,
            level: h.level + 1,
            population: h.population + 1,
            happiness: Math.min(100, h.happiness + 10)
          }
          : h
      ),
      resources: updatedResources
    }));
  }
}

export function bootstrapFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (): void {
    const state = get();

    // Give instant resources
    const bootstrapAmounts = {
      wood: 1000,
      berries: 500,
      stone: 800,
      gold: 5000,
      hatchet: 5,
      pickaxe: 3,
      thatch: 200
    };

    const updatedResources = { ...state.resources };

    // Add resources to existing amounts
    Object.entries(bootstrapAmounts).forEach(([resourceKey, amount]) => {
      if (updatedResources[resourceKey]) {
        updatedResources[resourceKey] = {
          ...updatedResources[resourceKey],
          amount: updatedResources[resourceKey].amount + amount
        };
      } else {
        // Initialize resource if it doesn't exist
        updatedResources[resourceKey] = {
          amount: amount,
          perSecond: 0,
          workers: 0,
          paidWorkers: 0,
          workerCost: 100,
          workerSalary: 10,
          isGathering: false,
          gatherProgress: 0,
          workerProgress: 0,
          autoSellThreshold: 0,
          autoSellEnabled: false
        };
      }
    });

    set((state) => ({
      ...state,
      resources: updatedResources
    }));
  }
}

export function hireWorkerFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (resourceKey: string): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource) return;

    // Get gold resource
    const gold = state.resources.gold;
    if (!gold || gold.amount < resource.workerCost) return;

    // Get salary from resource definition
    const resourceDefs: Record<string, { workerSalary: number }> = {
      wood: { workerSalary: WoodDef.workerSalary },
      berries: { workerSalary: BerryDef.workerSalary },
      stone: { workerSalary: StoneDef.workerSalary },
      hatchet: { workerSalary: HatchetDef.workerSalary },
      pickaxe: { workerSalary: PickaxeDef.workerSalary },
      thatch: { workerSalary: ThatchDef.workerSalary }
    };
    const resourceDef = resourceDefs[resourceKey];
    const workerSalary = resourceDef?.workerSalary || 10;

    set((state) => ({
      ...state,
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...resource,
          workers: resource.workers + 1,
          perSecond: resource.perSecond + 1,
          workerCost: Math.floor(resource.workerCost * 1.15),
          workerSalary: workerSalary
        },
        gold: {
          ...gold,
          amount: gold.amount - resource.workerCost
        }
      }
    }));
  }
}

export function startGatheringFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (resourceKey: string): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource) return;

    // Check if materials are available before starting gathering
    if (!gameStoreUtil.checkMaterialsAvailable(resourceKey, state)) {
      return; // Don't start gathering if materials aren't available
    }

    // Only start gathering if not already gathering
    if (!resource.isGathering) {
      set((state) => ({
        ...state,
        resources: {
          ...state.resources,
          [resourceKey]: {
            ...resource,
            isGathering: true,
            gatherProgress: 0
          }
        }
      }));
    }
  }
}

export function resetGatherProgressFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string): void {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          isGathering: false,
          gatherProgress: 0
        }
      }
    }));
  }
}

export function resetWorkerProgressFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string): void {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          workerProgress: 0
        }
      }
    }));
  }
}

export function initializeResourceFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (resourceKey: string): void {
    const state = get();
    if (state.resources[resourceKey]) return; // Already initialized

    // Get default values from resource definitions
    const resourceDefs: Record<string, { workerCost: number; workerSalary: number }> = {
      wood: { workerCost: WoodDef.workerCost, workerSalary: WoodDef.workerSalary },
      berries: { workerCost: BerryDef.workerCost, workerSalary: BerryDef.workerSalary },
      stone: { workerCost: StoneDef.workerCost, workerSalary: StoneDef.workerSalary },
      hatchet: { workerCost: HatchetDef.workerCost, workerSalary: HatchetDef.workerSalary },
      pickaxe: { workerCost: PickaxeDef.workerCost, workerSalary: PickaxeDef.workerSalary },
      thatch: { workerCost: ThatchDef.workerCost, workerSalary: ThatchDef.workerSalary }
    };
    const resourceDef = resourceDefs[resourceKey];
    const defaultWorkerCost = resourceDef?.workerCost || 100;
    const defaultWorkerSalary = resourceDef?.workerSalary || 10;

    set((state) => ({
      ...state,
      resources: {
        ...state.resources,
        [resourceKey]: {
          amount: 0,
          perSecond: 0,
          workers: 0,
          paidWorkers: 0,
          workerCost: defaultWorkerCost,
          workerSalary: defaultWorkerSalary,
          isGathering: false,
          gatherProgress: 0,
          workerProgress: 0,
          autoSellThreshold: 0,
          autoSellEnabled: false
        }
      }
    }));
  }
}

export function sellResourceFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (resourceKey: string, amount: number): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || resource.amount < amount) return;

    const sellPrice = gameStoreUtil.getSellPrice(resourceKey);
    const goldEarned = amount * sellPrice;

    // Initialize gold resource if it doesn't exist
    if (!state.resources.gold) {
      state.resources.gold = {
        amount: 0,
        perSecond: 0,
        workers: 0,
        paidWorkers: 0,
        workerCost: 100,
        workerSalary: 0,
        isGathering: false,
        gatherProgress: 0,
        workerProgress: 0,
        autoSellThreshold: 0,
        autoSellEnabled: false
      };
    }

    set((state) => ({
      ...state,
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...resource,
          amount: resource.amount - amount
        },
        gold: {
          ...state.resources.gold,
          amount: state.resources.gold.amount + goldEarned
        }
      }
    }));
  }
}

export function sellResourcePercentageFactory(get: () => GameStore) {
  return function (resourceKey: string, percentage: number): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource) return;

    const amount = Math.floor(resource.amount * (percentage / 100));
    if (amount > 0) {
      get().sellResource(resourceKey, amount);
    }
  }
}

export function sellAllResourceFactory(get: () => GameStore) {
  return function (resourceKey: string): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || resource.amount === 0) return;

    get().sellResource(resourceKey, resource.amount);
  }
}

export function setAutoSellThresholdFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, threshold: number): void {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          autoSellThreshold: Math.max(0, threshold)
        }
      }
    }));
  }
}

export function setAutoSellEnabledFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, enabled: boolean): void {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          autoSellEnabled: enabled
        }
      }
    }));
  }
}

export function checkAutoSellFactory(get: () => GameStore) {
  return function (resourceKey: string): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || !resource.autoSellEnabled || resource.autoSellThreshold <= 0) return;

    // Add a buffer to prevent flickering - only sell when significantly over threshold
    const buffer = Math.max(1, Math.floor(resource.autoSellThreshold * 0.1)); // 10% buffer or minimum 1
    const sellThreshold = resource.autoSellThreshold + buffer;

    if (resource.amount > sellThreshold) {
      const amountToSell = resource.amount - resource.autoSellThreshold;
      get().sellResource(resourceKey, amountToSell);
    }
  }
}

export function payWorkerSalariesFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (resourceKey: string): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || resource.workers === 0 || resource.workerSalary <= 0) return;

    const gold = state.resources.gold;
    if (!gold) return;

    const totalSalaryCost = resource.workers * resource.workerSalary;

    if (gold.amount >= totalSalaryCost) {
      // Pay all workers
      set((state) => ({
        ...state,
        resources: {
          ...state.resources,
          [resourceKey]: {
            ...resource,
            paidWorkers: resource.workers
          },
          gold: {
            ...gold,
            amount: gold.amount - totalSalaryCost
          }
        }
      }));
    } else {
      // Pay as many workers as possible
      const affordableWorkers = Math.floor(gold.amount / resource.workerSalary);
      const actualCost = affordableWorkers * resource.workerSalary;

      set((state) => ({
        ...state,
        resources: {
          ...state.resources,
          [resourceKey]: {
            ...resource,
            paidWorkers: affordableWorkers
          },
          gold: {
            ...gold,
            amount: gold.amount - actualCost
          }
        }
      }));
    }
  }
}

export function equipToolFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (toolKey: string): void {
    const state = get();
    const toolResource = state.resources[toolKey];

    // Check if player has the tool
    if (!toolResource || toolResource.amount <= 0) return;

    // Get the tool category
    const toolCategory = toolCategories[toolKey];
    if (!toolCategory) return;

    set((state) => ({
      characterEquipment: {
        ...state.characterEquipment,
        [toolCategory]: toolKey
      },
      resources: {
        ...state.resources,
        [toolKey]: {
          ...toolResource,
          amount: toolResource.amount - 1 // Remove tool from inventory
        }
      }
    }));
  }
}

export function unequipToolFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (toolKey: string): void {
    const state = get();
    const toolCategory = toolCategories[toolKey];
    if (!toolCategory) return;

    const equippedTool = state.characterEquipment[toolCategory];
    if (!equippedTool || equippedTool !== toolKey) return;

    set((state) => ({
      characterEquipment: {
        ...state.characterEquipment,
        [toolCategory]: undefined
      },
      resources: {
        ...state.resources,
        [toolKey]: {
          ...state.resources[toolKey],
          amount: (state.resources[toolKey]?.amount || 0) + 1 // Return tool to inventory
        }
      }
    }));
  }
}

export function getEquippedToolFactory(get: () => GameState) {
  return function (toolKey: string): string | undefined {
    const state = get();
    const toolCategory = toolCategories[toolKey];
    if (!toolCategory) return undefined;

    return state.characterEquipment[toolCategory];
  }
}

export function getToolBonusFactory(get: () => GameState) {
  return function (resourceKey: string): number {
    const state = get();

    // Check all tool categories for effective tools
    for (const [toolKey, bonus] of Object.entries(toolBonuses)) {
      const effectiveResources = toolEffectiveness[toolKey] || [];
      if (effectiveResources.includes(resourceKey)) {
        const toolCategory = toolCategories[toolKey];
        if (toolCategory && state.characterEquipment[toolCategory] === toolKey) {
          return bonus;
        }
      }
    }

    return 0;
  }
}

export function getWorkerToolBonusFactory(get: () => GameState) {
  return function (resourceKey: string): number {
    const state = get();
    const resource = state.resources[resourceKey];

    if (!resource || resource.paidWorkers === 0) return 0;

    // Find available tools for this resource
    for (const [toolKey, bonus] of Object.entries(toolBonuses)) {
      const effectiveResources = toolEffectiveness[toolKey] || [];
      if (effectiveResources.includes(resourceKey)) {
        const toolResource = state.resources[toolKey];
        if (toolResource && toolResource.amount > 0) {
          return bonus; // Return the bonus percentage if tools are available
        }
      }
    }

    return 0;
  }
}

export function getWorkersWithToolsFactory(get: () => GameState) {
  return function (resourceKey: string): number {
    const state = get();
    const resource = state.resources[resourceKey];

    if (!resource || resource.paidWorkers === 0) return 0;

    // Find available tools for this resource
    for (const [toolKey] of Object.entries(toolBonuses)) {
      const effectiveResources = toolEffectiveness[toolKey] || [];
      if (effectiveResources.includes(resourceKey)) {
        const toolResource = state.resources[toolKey];
        if (toolResource && toolResource.amount > 0) {
          // Workers automatically use available tools, limited by number of workers
          return Math.min(resource.paidWorkers, toolResource.amount);
        }
      }
    }

    return 0;
  }
}

export function startGameLoopFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameStore) {
  return function (): void {
    const state = get();
    if (state.gameLoopInterval) return; // Already running

    const interval = setInterval(() => {
      get().gameTick();
    }, 20); // 20ms = 50 FPS

    set((state) => ({ ...state, gameLoopInterval: interval }));
  }
}

export function stopGameLoopFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameStore) {
  return function (): void {
    const state = get();
    if (state.gameLoopInterval) {
      clearInterval(state.gameLoopInterval);
      set((state) => ({ ...state, gameLoopInterval: undefined }));
    }
  }
}

export function getPlayerStatsFactory(get: () => GameState) {
  return function (): PlayerStats {
    return get().playerStats;
  }
}

export function setPlayerStatsFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (stats: Partial<PlayerStats>): void {
    set((state) => ({
      playerStats: { ...state.playerStats, ...stats }
    }));
  }
}

export function updatePlayerWarmthFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (timeOfDay: number): void {
    const state = get();
    const currentWarmth = state.playerStats.warmth;
    
    // Calculate warmth change based on time of day
    // Warmer during day (6-18), cooler at night
    let warmthChange = 0;
    
    if (timeOfDay >= 6 && timeOfDay < 18) {
      // Day time: gradually warm up
      warmthChange = 0.5;
    } else {
      // Night time: gradually cool down
      warmthChange = -0.3;
    }
    
    const newWarmth = Math.max(0, Math.min(100, currentWarmth + warmthChange));
    
    set((state) => ({
      playerStats: {
        ...state.playerStats,
        warmth: newWarmth
      }
    }));
  }
}