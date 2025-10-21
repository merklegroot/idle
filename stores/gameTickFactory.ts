import { GameState, GameStore, ResourceState } from './gameStoreModels';
import { gameStoreUtil } from './gameStoreUtil';

// Constants for game timing and mechanics
const TICK_INTERVAL_MS = 20; // Each tick represents 20ms
const PROGRESS_PER_TICK = 2; // 2% progress per tick (100% per 1000ms)

// Type for resource updates
type ResourceUpdates = Partial<Record<string, Partial<ResourceState>>>;

/**
 * Processes manual gathering for a single resource
 */
function processManualGathering(
  resourceKey: string, 
  resource: ResourceState, 
  get: () => GameStore
): Partial<ResourceState> {
  if (!resource.isGathering) {
    return {};
  }

  const actualProgress = PROGRESS_PER_TICK;
  const newProgress = resource.gatherProgress + actualProgress;

  if (newProgress >= 100) {
    // Check if materials are available before producing
    if (gameStoreUtil.checkAndConsumeMaterials(resourceKey, get())) {
      return {
        amount: resource.amount + 1,
        isGathering: false,
        gatherProgress: 0
      };
    } else {
      return {
        isGathering: false,
        gatherProgress: 0
      };
    }
  } else {
    return {
      gatherProgress: newProgress
    };
  }
}

/**
 * Processes worker production for a single resource
 */
function processWorkerProduction(
  resourceKey: string, 
  resource: ResourceState, 
  get: () => GameStore
): Partial<ResourceState> {
  if (resource.paidWorkers <= 0) {
    return {};
  }

  const actualProgressPerWorker = PROGRESS_PER_TICK;
  const newWorkerProgress = resource.workerProgress + (resource.paidWorkers * actualProgressPerWorker);

  if (newWorkerProgress >= 100) {
    // Check if materials are available for each worker
    let workersThatCanProduce = 0;
    for (let i = 0; i < resource.paidWorkers; i++) {
      if (gameStoreUtil.checkAndConsumeMaterials(resourceKey, get())) {
        workersThatCanProduce++;
      }
    }

    return {
      amount: resource.amount + workersThatCanProduce,
      workerProgress: 0
    };
  } else {
    return {
      workerProgress: newWorkerProgress
    };
  }
}

/**
 * Merges resource updates and auto-sell updates
 */
function mergeUpdates(
  resourceUpdates: ResourceUpdates,
  autoSellUpdates: ResourceUpdates
): ResourceUpdates {
  const allUpdates = { ...resourceUpdates };
  
  Object.entries(autoSellUpdates).forEach(([key, update]) => {
    if (allUpdates[key]) {
      allUpdates[key] = { ...allUpdates[key], ...update };
    } else {
      allUpdates[key] = update;
    }
  });

  return allUpdates;
}

/**
 * Applies all updates to the game state
 */
function applyUpdates(
  updates: ResourceUpdates,
  set: (fn: (state: GameState) => Partial<GameState>) => void
): void {
  if (Object.keys(updates).length > 0) {
    set((state) => ({
      resources: Object.entries(state.resources).reduce((acc, [key, resource]) => {
        acc[key] = { ...resource, ...(updates[key] || {}) };
        return acc;
      }, {} as Record<string, ResourceState>),
      tickCount: (state.tickCount || 0) + 1
    }));
  } else {
    set((state) => ({ ...state, tickCount: (state.tickCount || 0) + 1 }));
  }
}

export function gameTickFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameStore) {
  return function (): void {
    const state = get();
    const resourceUpdates: ResourceUpdates = {};

    // Process each resource for manual gathering and worker production
    Object.entries(state.resources).forEach(([resourceKey, resource]) => {
      const manualGatheringUpdates = processManualGathering(resourceKey, resource, get);
      const workerProductionUpdates = processWorkerProduction(resourceKey, resource, get);
      
      // Merge updates for this resource
      const resourceUpdate = { ...manualGatheringUpdates, ...workerProductionUpdates };
      
      if (Object.keys(resourceUpdate).length > 0) {
        resourceUpdates[resourceKey] = resourceUpdate;
      }
    });

    applyUpdates(resourceUpdates, set);
  }
}