import { GameState, GameStore, ResourceState } from './gameStoreModels';
import { gameStoreUtil } from './gameStoreUtil';

// Constants for game timing and mechanics
const TICK_INTERVAL_MS = 20; // Each tick represents 20ms
const PROGRESS_PER_TICK = 2; // 2% progress per tick (100% per 1000ms)
const SALARY_PAYMENT_INTERVAL = 50; // Pay salaries every 50 ticks (1 second)
const AUTO_SELL_BUFFER_PERCENTAGE = 0.1; // 10% buffer for auto-sell threshold
const MIN_AUTO_SELL_BUFFER = 1; // Minimum buffer amount

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

  const toolBonus = get().getToolBonus(resourceKey);
  const bonusMultiplier = 1 + (toolBonus / 100);
  const actualProgress = PROGRESS_PER_TICK * bonusMultiplier;
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

  const workerToolBonus = get().getWorkerToolBonus(resourceKey);
  const bonusMultiplier = 1 + (workerToolBonus / 100);
  const actualProgressPerWorker = PROGRESS_PER_TICK * bonusMultiplier;
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
 * Calculates auto-sell updates for a single resource
 */
function calculateAutoSellUpdates(
  resourceKey: string,
  resource: ResourceState,
  newAmount: number,
  state: GameState
): { resourceUpdate: Partial<ResourceState>; goldEarned: number } {
  if (!resource.autoSellEnabled || resource.autoSellThreshold <= 0) {
    return { resourceUpdate: {}, goldEarned: 0 };
  }

  const buffer = Math.max(MIN_AUTO_SELL_BUFFER, Math.floor(resource.autoSellThreshold * AUTO_SELL_BUFFER_PERCENTAGE));
  const sellThreshold = resource.autoSellThreshold + buffer;

  if (newAmount <= sellThreshold) {
    return { resourceUpdate: {}, goldEarned: 0 };
  }

  const amountToSell = newAmount - resource.autoSellThreshold;
  const sellPrice = gameStoreUtil.getSellPrice(resourceKey);
  const goldEarned = amountToSell * sellPrice;

  return {
    resourceUpdate: {
      amount: newAmount - amountToSell
    },
    goldEarned
  };
}

/**
 * Processes auto-sell for all resources
 */
function processAutoSell(
  state: GameState,
  resourceUpdates: ResourceUpdates
): ResourceUpdates {
  const autoSellUpdates: ResourceUpdates = {};
  let totalGoldEarned = 0;

  Object.entries(state.resources).forEach(([resourceKey, resource]) => {
    const resourceUpdate = resourceUpdates[resourceKey] || {};
    const newAmount = resourceUpdate.amount !== undefined ? resourceUpdate.amount : resource.amount;
    
    const autoSellResult = calculateAutoSellUpdates(resourceKey, resource, newAmount, state);
    
    if (Object.keys(autoSellResult.resourceUpdate).length > 0) {
      autoSellUpdates[resourceKey] = autoSellResult.resourceUpdate;
    }
    
    if (autoSellResult.goldEarned > 0) {
      totalGoldEarned += autoSellResult.goldEarned;
    }
  });

  // Add gold earned from auto-sell
  if (totalGoldEarned > 0) {
    autoSellUpdates.gold = { 
      amount: (state.resources.gold?.amount || 0) + totalGoldEarned 
    };
  }

  return autoSellUpdates;
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
    
    // Process auto-sell
    const autoSellUpdates = processAutoSell(state, resourceUpdates);

    // Merge all updates and apply them
    const allUpdates = mergeUpdates(resourceUpdates, autoSellUpdates);
    applyUpdates(allUpdates, set);
  }
}