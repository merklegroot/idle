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
}

type GameStore = GameState & GameActions;

const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  resources: {},

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
    if (!resource || resource.amount < resource.workerCost) return;

    set({
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...resource,
          amount: resource.amount - resource.workerCost,
          workers: resource.workers + 1,
          perSecond: resource.perSecond + 1,
          workerCost: Math.floor(resource.workerCost * 1.15)
        }
      }
    });
  },

  startGathering: (resourceKey: string) => {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource || resource.isGathering) return;

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
  }
}));

export default useGameStore;
