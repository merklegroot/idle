import { GameState, GameStore, PlayerStats } from './gameStoreModels';
import { gameStoreUtil } from './gameStoreUtil';
import { CRAFTING_RECIPES } from '@/constants/craftingRecipes';

export function getResourceFactory(get: () => GameState) {
  return (resourceKey: string) => {
    return get().resources[resourceKey];
  }
}

export function setResourceQuantityFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, quantity: number): void {
    set((state) => ({
      resources: { ...state.resources, [resourceKey]: { ...state.resources[resourceKey], quantity } }
    }));
  }
}

export function addResourceQuantityFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (resourceKey: string, quantity: number): void {
    set((state) => {
      const existingResource = state.resources[resourceKey];
      if (!existingResource) {
        // Initialize resource if it doesn't exist
        return {
          resources: {
            ...state.resources,
            [resourceKey]: {
              quantity: quantity,
              perSecond: 0,
              workers: 0,
              paidWorkers: 0,
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
            quantity: existingResource.quantity + quantity 
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

export function bootstrapFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (): void {
    const state = get();

    // Give instant resources
    const bootstrapQuantities = {
      wood: 1000,
      berries: 500,
      stone: 800,
      gold: 5000,
      hatchet: 5,
      pickaxe: 3,
      thatch: 200
    };

    const updatedResources = { ...state.resources };

    // Add resources to existing quantities
    Object.entries(bootstrapQuantities).forEach(([resourceKey, quantity]) => {
      if (updatedResources[resourceKey]) {
        updatedResources[resourceKey] = {
          ...updatedResources[resourceKey],
          quantity: updatedResources[resourceKey].quantity + quantity
        };
      } else {
        // Initialize resource if it doesn't exist
        updatedResources[resourceKey] = {
          quantity: quantity,
          perSecond: 0,
          workers: 0,
          paidWorkers: 0,
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

export function startGatheringFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (resourceKey: string): void {
    const state = get();
    const resource = state.resources[resourceKey];
    if (!resource) return;

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

export function initializeResourceFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (resourceKey: string): void {
    const state = get();
    if (state.resources[resourceKey]) return; // Already initialized


    set((state) => ({
      ...state,
      resources: {
        ...state.resources,
        [resourceKey]: {
          quantity: 0,
          perSecond: 0,
          workers: 0,
          paidWorkers: 0,
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

export function drinkWaterFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (): void {
    const state = get();
    const currentStats = state.playerStats;
    
    // Increase hydration by 20, capped at 100
    const newHydration = Math.min(100, currentStats.hydration + 20);
    
    set((state) => ({
      ...state,
      playerStats: {
        ...state.playerStats,
        hydration: newHydration
      }
    }));
  }
}

// Time management factories
export function getTimeOfDayFactory(get: () => GameState) {
  return function (): number {
    return get().timeOfDay;
  }
}

export function getDayFactory(get: () => GameState) {
  return function (): number {
    return get().day;
  }
}

export function setTimeOfDayFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (timeOfDay: number): void {
    set((state) => ({
      ...state,
      timeOfDay: timeOfDay
    }));
  }
}

export function setDayFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (day: number): void {
    set((state) => ({
      ...state,
      day: day
    }));
  }
}

export function advanceTimeFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (): void {
    const state = get();
    const newTime = state.timeOfDay + 0.1; // Advance time by 0.1 hours
    
    if (newTime >= 24) {
      set((state) => ({
        ...state,
        timeOfDay: 0,
        day: state.day + 1
      }));
    } else {
      set((state) => ({
        ...state,
        timeOfDay: newTime
      }));
    }
  }
}

// Crafting management factories
export function canCraftRecipeFactory(get: () => GameState) {
  return function (recipeId: string): boolean {
    const state = get();
    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    
    if (!recipe) {
      return false;
    }
    
    // Check if player has all required ingredients
    return recipe.ingredients.every(ingredient => {
      const resource = state.resources[ingredient.resourceKey];
      return resource && resource.quantity >= ingredient.quantity;
    });
  }
}

export function craftRecipeFactory(set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) {
  return function (recipeId: string): boolean {
    const state = get();
    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    
    if (!recipe) {
      return false;
    }
    
    // Check if player can craft this recipe
    const canCraft = recipe.ingredients.every(ingredient => {
      const resource = state.resources[ingredient.resourceKey];
      return resource && resource.quantity >= ingredient.quantity;
    });
    
    if (!canCraft) {
      return false;
    }
    
    // Deduct ingredients
    recipe.ingredients.forEach(ingredient => {
      const resource = state.resources[ingredient.resourceKey];
      if (resource) {
        set((state) => ({
          resources: {
            ...state.resources,
            [ingredient.resourceKey]: {
              ...resource,
              quantity: resource.quantity - ingredient.quantity
            }
          }
        }));
      }
    });
    
    // Add result
    const resultResource = state.resources[recipe.result.resourceKey];
    if (resultResource) {
      set((state) => ({
        resources: {
          ...state.resources,
          [recipe.result.resourceKey]: {
            ...resultResource,
            quantity: resultResource.quantity + recipe.result.quantity
          }
        }
      }));
    } else {
      // Initialize resource if it doesn't exist
      set((state) => ({
        resources: {
          ...state.resources,
          [recipe.result.resourceKey]: {
            quantity: recipe.result.quantity,
            perSecond: 0,
            workers: 0,
            paidWorkers: 0,
            isGathering: false,
            gatherProgress: 0,
            workerProgress: 0,
            autoSellThreshold: 0,
            autoSellEnabled: false
          }
        }
      }));
    }
    
    return true;
  }
}

export function resetFactory(set: (fn: (state: GameState) => Partial<GameState>) => void) {
  return function (): void {
    set(() => ({
      resources: {},
      playerStats: {
        health: 100,
        warmth: 50,
        food: 80,
        hydration: 70
      },
      timeOfDay: 12,
      day: 1
    }));
  }
}