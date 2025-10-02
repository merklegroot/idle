import { create } from 'zustand';

export interface ResourceState {
  amount: number;
  perSecond: number;
  workers: number;
  workerCost: number;
  isGathering: boolean;
  gatherProgress: number;
  workerProgress: number;
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
  setResourceWorkerCost: (resourceKey: string, workerCost: number) => void;
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

    set({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...resource,
          workers: resource.workers + 1,
          perSecond: resource.perSecond + 1,
          workerCost: Math.floor(resource.workerCost * 1.15)
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

    set({
      resources: {
        ...state.resources,
        [resourceKey]: {
          amount: 0,
          perSecond: 0,
          workers: 0,
          workerCost: 10,
          isGathering: false,
          gatherProgress: 0,
          workerProgress: 0
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
        workerCost: 10,
        isGathering: false,
        gatherProgress: 0,
        workerProgress: 0
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

    // Process each resource
    Object.entries(state.resources).forEach(([resourceKey, resource]) => {
      const resourceUpdates: Partial<ResourceState> = {};

      // Handle manual gathering progress
      if (resource.isGathering) {
        const newProgress = resource.gatherProgress + 2; // 2% per 20ms = 100% per 1000ms
        if (newProgress >= 100) {
          resourceUpdates.amount = resource.amount + 1;
          resourceUpdates.isGathering = false;
          resourceUpdates.gatherProgress = 0;
        } else {
          resourceUpdates.gatherProgress = newProgress;
        }
      }

      // Handle worker progress
      if (resource.workers > 0) {
        const progressPerWorker = 2; // 2% per 20ms per worker
        const newWorkerProgress = resource.workerProgress + (resource.workers * progressPerWorker);
        if (newWorkerProgress >= 100) {
          resourceUpdates.amount = resource.amount + resource.workers;
          resourceUpdates.workerProgress = 0;
        } else {
          resourceUpdates.workerProgress = newWorkerProgress;
        }
      }

      // Add per-second production (every 50 ticks = 1 second)
      if (state.tickCount && state.tickCount % 50 === 0) {
        resourceUpdates.amount = resource.amount + resource.perSecond;
      }

      if (Object.keys(resourceUpdates).length > 0) {
        updates[resourceKey] = resourceUpdates;
      }
    });

    // Apply all updates
    if (Object.keys(updates).length > 0) {
      set((state) => ({
        resources: Object.entries(state.resources).reduce((acc, [key, resource]) => {
          acc[key] = { ...resource, ...(updates[key] || {}) };
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
    wood: 2,    // Wood sells for 2 gold each
    berries: 1  // Berries sell for 1 gold each
  };
  return prices[resourceKey] || 1;
};

export default useGameStore;
