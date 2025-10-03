import { GameState, GameStore, ResourceState } from './gameStoreModels';
import { gameStoreUtil } from './gameStoreUtil';

export function gameTickFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameStore) {
    return function (): void {
      const state = get();
      const updates: Partial<Record<string, Partial<ResourceState>>> = {};
      const autoSellUpdates: Partial<Record<string, Partial<ResourceState>>> = {};
  
      // Process each resource
      Object.entries(state.resources).forEach(([resourceKey, resource]) => {
        const resourceUpdates: Partial<ResourceState> = {};
  
        // Handle manual gathering progress
        if (resource.isGathering) {
          // Apply tool bonus for manual gathering
          const toolBonus = get().getToolBonus(resourceKey);
          const baseProgress = 2; // 2% per 20ms = 100% per 1000ms
          const bonusMultiplier = 1 + (toolBonus / 100);
          const actualProgress = baseProgress * bonusMultiplier;
  
          const newProgress = resource.gatherProgress + actualProgress;
          if (newProgress >= 100) {
            // Check if materials are available before producing
            if (gameStoreUtil.checkAndConsumeMaterials(resourceKey, state)) {
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
          // Workers benefit from individual tools they have equipped
          const workerToolBonus = get().getWorkerToolBonus(resourceKey);
          const baseProgressPerWorker = 2; // 2% per 20ms per worker
          const bonusMultiplier = 1 + (workerToolBonus / 100);
          const actualProgressPerWorker = baseProgressPerWorker * bonusMultiplier;
  
          const newWorkerProgress = resource.workerProgress + (resource.paidWorkers * actualProgressPerWorker);
          if (newWorkerProgress >= 100) {
            // Check if materials are available for each worker
            let workersThatCanProduce = 0;
            for (let i = 0; i < resource.paidWorkers; i++) {
              if (gameStoreUtil.checkAndConsumeMaterials(resourceKey, state)) {
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
            const sellPrice = gameStoreUtil.getSellPrice(resourceKey);
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
        set((state) => ({ ...state, tickCount: (state.tickCount || 0) + 1 }));
      }
    }
  }