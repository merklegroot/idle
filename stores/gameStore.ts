import { create } from 'zustand';
import { WoodDef, BerryDef, StoneDef, HatchetDef } from '../app/models/ResourceDef';

export interface ResourceState {
  amount: number;
  perSecond: number;
  workers: number;
  paidWorkers: number;
  workerCost: number;
  workerSalary: number;
  isGathering: boolean;
  gatherProgress: number;
  workerProgress: number;
  autoSellThreshold: number;
  autoSellEnabled: boolean;
}

export interface GameState {
  resources: Record<string, ResourceState>;
  gameLoopInterval?: NodeJS.Timeout;
  tickCount: number;
}

export interface GameActions {
  // Resource management
  getResource: (resourceKey: string) => ResourceState | undefined;
  setResourceAmount: (resourceKey: string, amount: number) => void;
  addResourceAmount: (resourceKey: string, amount: number) => void;
  setResourcePerSecond: (resourceKey: string, perSecond: number) => void;
  setResourceWorkers: (resourceKey: string, workers: number) => void;
  setResourcePaidWorkers: (resourceKey: string, paidWorkers: number) => void;
  setResourceWorkerCost: (resourceKey: string, workerCost: number) => void;
  setResourceWorkerSalary: (resourceKey: string, workerSalary: number) => void;
  setResourceIsGathering: (resourceKey: string, isGathering: boolean) => void;
  setResourceGatherProgress: (resourceKey: string, gatherProgress: number) => void;
  setResourceWorkerProgress: (resourceKey: string, workerProgress: number) => void;
  
  // Actions
  hireWorker: (resourceKey: string) => void;
  startGathering: (resourceKey: string) => void;
  resetGatherProgress: (resourceKey: string) => void;
  resetWorkerProgress: (resourceKey: string) => void;
  
  // Initialize resource
  initializeResource: (resourceKey: string) => void;
  
  // Selling
  sellResource: (resourceKey: string, amount: number) => void;
  sellResourcePercentage: (resourceKey: string, percentage: number) => void;
  sellAllResource: (resourceKey: string) => void;
  
  // Auto-sell
  setAutoSellThreshold: (resourceKey: string, threshold: number) => void;
  setAutoSellEnabled: (resourceKey: string, enabled: boolean) => void;
  checkAutoSell: (resourceKey: string) => void;
  
  // Salary system
  payWorkerSalaries: (resourceKey: string) => void;
  
  // Game loop
  startGameLoop: () => void;
  stopGameLoop: () => void;
  gameTick: () => void;
}

type GameStore = GameState & GameActions;

const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  resources: {},
  gameLoopInterval: undefined,
  tickCount: 0,

  // Resource management
  getResource: (resourceKey: string) => {
    const state = get();
    return state.resources[resourceKey];
  },

  setResourceAmount: (resourceKey: string, amount: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          amount
        }
      }
    }));
  },

  addResourceAmount: (resourceKey: string, amount: number) => {
    set((state) => {
      const currentResource = state.resources[resourceKey];
      if (!currentResource) return state;
      
      return {
        resources: {
          ...state.resources,
          [resourceKey]: {
            ...currentResource,
            amount: currentResource.amount + amount
          }
        }
      };
    });
  },

  setResourcePerSecond: (resourceKey: string, perSecond: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          perSecond
        }
      }
    }));
  },

  setResourceWorkers: (resourceKey: string, workers: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          workers
        }
      }
    }));
  },

  setResourcePaidWorkers: (resourceKey: string, paidWorkers: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          paidWorkers
        }
      }
    }));
  },

  setResourceWorkerCost: (resourceKey: string, workerCost: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          workerCost
        }
      }
    }));
  },

  setResourceWorkerSalary: (resourceKey: string, workerSalary: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          workerSalary
        }
      }
    }));
  },

  setResourceIsGathering: (resourceKey: string, isGathering: boolean) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          isGathering
        }
      }
    }));
  },

  setResourceGatherProgress: (resourceKey: string, gatherProgress: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          gatherProgress
        }
      }
    }));
  },

  setResourceWorkerProgress: (resourceKey: string, workerProgress: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          workerProgress
        }
      }
    }));
  },

  // Actions
  hireWorker: (resourceKey: string) => {
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
      hatchet: { workerSalary: HatchetDef.workerSalary }
    };
    const resourceDef = resourceDefs[resourceKey];
    const workerSalary = resourceDef?.workerSalary || 10;

    set({
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
    });
  },

  startGathering: (resourceKey: string) => {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource) return;

    // Check if materials are available before starting gathering
    if (!checkMaterialsAvailable(resourceKey, state)) {
      return; // Don't start gathering if materials aren't available
    }

    // Only start gathering if not already gathering
    if (!resource.isGathering) {
      set({
        resources: {
          ...state.resources,
          [resourceKey]: {
            ...resource,
            isGathering: true,
            gatherProgress: 0
          }
        }
      });
    }
  },

  resetGatherProgress: (resourceKey: string) => {
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
  },

  resetWorkerProgress: (resourceKey: string) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          workerProgress: 0
        }
      }
    }));
  },

  // Initialize resource
  initializeResource: (resourceKey: string) => {
    const state = get();
    if (state.resources[resourceKey]) return; // Already initialized

    // Get default values from resource definitions
    const resourceDefs: Record<string, { workerCost: number; workerSalary: number }> = {
      wood: { workerCost: WoodDef.workerCost, workerSalary: WoodDef.workerSalary },
      berries: { workerCost: BerryDef.workerCost, workerSalary: BerryDef.workerSalary },
      stone: { workerCost: StoneDef.workerCost, workerSalary: StoneDef.workerSalary },
      hatchet: { workerCost: HatchetDef.workerCost, workerSalary: HatchetDef.workerSalary }
    };
    const resourceDef = resourceDefs[resourceKey];
    const defaultWorkerCost = resourceDef?.workerCost || 100;
    const defaultWorkerSalary = resourceDef?.workerSalary || 10;

    set({
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
    });
  },

  // Selling functions
  sellResource: (resourceKey: string, amount: number) => {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || resource.amount < amount) return;

    const sellPrice = getSellPrice(resourceKey);
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

    set({
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
    });
  },

  sellResourcePercentage: (resourceKey: string, percentage: number) => {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource) return;

    const amount = Math.floor(resource.amount * (percentage / 100));
    if (amount > 0) {
      get().sellResource(resourceKey, amount);
    }
  },

  sellAllResource: (resourceKey: string) => {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || resource.amount === 0) return;

    get().sellResource(resourceKey, resource.amount);
  },

  // Auto-sell functions
  setAutoSellThreshold: (resourceKey: string, threshold: number) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          autoSellThreshold: Math.max(0, threshold)
        }
      }
    }));
  },

  setAutoSellEnabled: (resourceKey: string, enabled: boolean) => {
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          autoSellEnabled: enabled
        }
      }
    }));
  },

  checkAutoSell: (resourceKey: string) => {
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
  },

  // Salary system
  payWorkerSalaries: (resourceKey: string) => {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || resource.workers === 0 || resource.workerSalary <= 0) return;

    const gold = state.resources.gold;
    if (!gold) return;

    const totalSalaryCost = resource.workers * resource.workerSalary;
    
    if (gold.amount >= totalSalaryCost) {
      // Pay all workers
      set({
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
      });
    } else {
      // Pay as many workers as possible
      const affordableWorkers = Math.floor(gold.amount / resource.workerSalary);
      const actualCost = affordableWorkers * resource.workerSalary;
      
      set({
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
      });
    }
  },

  // Game loop
  startGameLoop: () => {
    const state = get();
    if (state.gameLoopInterval) return; // Already running

    const interval = setInterval(() => {
      get().gameTick();
    }, 20); // 20ms = 50 FPS

    set({ gameLoopInterval: interval });
  },

  stopGameLoop: () => {
    const state = get();
    if (state.gameLoopInterval) {
      clearInterval(state.gameLoopInterval);
      set({ gameLoopInterval: undefined });
    }
  },

  gameTick: () => {
    const state = get();
    const updates: Partial<Record<string, Partial<ResourceState>>> = {};
    const autoSellUpdates: Partial<Record<string, Partial<ResourceState>>> = {};

    // Process each resource
    Object.entries(state.resources).forEach(([resourceKey, resource]) => {
      const resourceUpdates: Partial<ResourceState> = {};

      // Handle manual gathering progress
      if (resource.isGathering) {
        const newProgress = resource.gatherProgress + 2; // 2% per 20ms = 100% per 1000ms
        if (newProgress >= 100) {
          // Check if materials are available before producing
          if (checkAndConsumeMaterials(resourceKey, state)) {
            resourceUpdates.amount = resource.amount + 1;
          }
          resourceUpdates.isGathering = false;
          resourceUpdates.gatherProgress = 0;
        } else {
          resourceUpdates.gatherProgress = newProgress;
        }
      }

      // Handle worker progress (only paid workers work)
      if (resource.paidWorkers > 0) {
        const progressPerWorker = 2; // 2% per 20ms per worker
        const newWorkerProgress = resource.workerProgress + (resource.paidWorkers * progressPerWorker);
        if (newWorkerProgress >= 100) {
          // Check if materials are available for each worker
          let workersThatCanProduce = 0;
          for (let i = 0; i < resource.paidWorkers; i++) {
            if (checkAndConsumeMaterials(resourceKey, state)) {
              workersThatCanProduce++;
            }
          }
          if (workersThatCanProduce > 0) {
            resourceUpdates.amount = resource.amount + workersThatCanProduce;
          }
          resourceUpdates.workerProgress = 0;
        } else {
          resourceUpdates.workerProgress = newWorkerProgress;
        }
      }

      // Pay salaries and update paid workers (every 50 ticks = 1 second)
      if (state.tickCount && state.tickCount % 50 === 0) {
        get().payWorkerSalaries(resourceKey);
      }

      if (Object.keys(resourceUpdates).length > 0) {
        updates[resourceKey] = resourceUpdates;
      }
    });

    // Calculate auto-sell updates based on the new amounts
    Object.entries(state.resources).forEach(([resourceKey, resource]) => {
      const resourceUpdate = updates[resourceKey] || {};
      const newAmount = resourceUpdate.amount !== undefined ? resourceUpdate.amount : resource.amount;
      
      // Check auto-sell conditions
      if (resource.autoSellEnabled && resource.autoSellThreshold > 0) {
        const buffer = Math.max(1, Math.floor(resource.autoSellThreshold * 0.1)); // 10% buffer or minimum 1
        const sellThreshold = resource.autoSellThreshold + buffer;
        
        if (newAmount > sellThreshold) {
          const amountToSell = newAmount - resource.autoSellThreshold;
          const sellPrice = getSellPrice(resourceKey);
          const goldEarned = amountToSell * sellPrice;

          // Update resource amount (reduce by sold amount)
          if (!autoSellUpdates[resourceKey]) {
            autoSellUpdates[resourceKey] = {};
          }
          autoSellUpdates[resourceKey].amount = newAmount - amountToSell;

          // Update gold amount
          if (!autoSellUpdates.gold) {
            autoSellUpdates.gold = { amount: (state.resources.gold?.amount || 0) + goldEarned };
          } else {
            autoSellUpdates.gold.amount = (autoSellUpdates.gold.amount || 0) + goldEarned;
          }
        }
      }
    });

    // Merge all updates together
    const allUpdates = { ...updates };
    Object.entries(autoSellUpdates).forEach(([key, update]) => {
      if (allUpdates[key]) {
        allUpdates[key] = { ...allUpdates[key], ...update };
      } else {
        allUpdates[key] = update;
      }
    });

    // Apply all updates at once
    if (Object.keys(allUpdates).length > 0) {
      set((state) => ({
        resources: Object.entries(state.resources).reduce((acc, [key, resource]) => {
          acc[key] = { ...resource, ...(allUpdates[key] || {}) };
          return acc;
        }, {} as Record<string, ResourceState>),
        tickCount: (state.tickCount || 0) + 1
      }));
    } else {
      set({ tickCount: (state.tickCount || 0) + 1 });
    }
  }
}));

// Helper function to get sell prices
const getSellPrice = (resourceKey: string): number => {
  const prices: Record<string, number> = {
    wood: WoodDef.sellPrice || 20,    // Wood sells for 20 gold each
    berries: BerryDef.sellPrice || 30,  // Berries sell for 30 gold each
    stone: StoneDef.sellPrice || 50,   // Stone sells for 50 gold each
    hatchet: HatchetDef.sellPrice || 75 // Hatchet sells for 75 gold each
  };
  return prices[resourceKey] || 1;
};

// Helper function to check if materials are available (without consuming)
const checkMaterialsAvailable = (resourceKey: string, state: GameState): boolean => {
  const resourceDefs: Record<string, { materials?: Array<{ resourceKey: string; amount: number }> }> = {
    wood: WoodDef,
    berries: BerryDef,
    stone: StoneDef,
    hatchet: HatchetDef
  };
  
  const resourceDef = resourceDefs[resourceKey];
  if (!resourceDef?.materials) return true; // No materials required
  
  // Check if all required materials are available
  for (const material of resourceDef.materials) {
    const materialResource = state.resources[material.resourceKey];
    if (!materialResource || materialResource.amount < material.amount) {
      return false; // Not enough materials
    }
  }
  
  return true; // Materials available
};

// Helper function to check and consume materials
const checkAndConsumeMaterials = (resourceKey: string, state: GameState): boolean => {
  const resourceDefs: Record<string, { materials?: Array<{ resourceKey: string; amount: number }> }> = {
    wood: WoodDef,
    berries: BerryDef,
    stone: StoneDef,
    hatchet: HatchetDef
  };
  
  const resourceDef = resourceDefs[resourceKey];
  if (!resourceDef?.materials) return true; // No materials required
  
  // Check if all required materials are available
  for (const material of resourceDef.materials) {
    const materialResource = state.resources[material.resourceKey];
    if (!materialResource || materialResource.amount < material.amount) {
      return false; // Not enough materials
    }
  }
  
  // Consume materials
  for (const material of resourceDef.materials) {
    const materialResource = state.resources[material.resourceKey];
    if (materialResource) {
      materialResource.amount -= material.amount;
    }
  }
  
  return true; // Materials consumed successfully
};

export default useGameStore;
