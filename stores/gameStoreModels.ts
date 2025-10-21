import { CharacterEquipment } from "../app/models/ResourceDef";
import { CraftingRecipe } from "../models/CraftingRecipe";

export interface ResourceState {
    amount: number;
    perSecond: number;
    workers: number;
    paidWorkers: number;
    workerCost: number;
    isGathering: boolean;
    gatherProgress: number;
    workerProgress: number;
    autoSellThreshold: number;
    autoSellEnabled: boolean;
}

export interface Home {
    id: string;
    level: number;
    population: number;
    happiness: number;
}

export interface HomeCost {
    wood: number;
    stone: number;
    gold: number;
}

export interface PlayerStats {
    health: number;
    warmth: number;
    food: number;
    hydration: number;
}

export interface GameState {
    resources: Record<string, ResourceState>;
    gameLoopInterval?: NodeJS.Timeout;
    tickCount: number;
    characterEquipment: CharacterEquipment;
    homes: Home[];
    playerStats: PlayerStats;
    timeOfDay: number; // 0-24 hours
    day: number;
    craftingRecipes: CraftingRecipe[];
}

export interface GameActions {
    // Resource management
    getResource: (resourceKey: string) => ResourceState | undefined;
    setResourceAmount: (resourceKey: string, amount: number) => void;
    addResourceAmount: (resourceKey: string, amount: number) => void;
    setResourcePerSecond: (resourceKey: string, perSecond: number) => void;
    setResourceIsGathering: (resourceKey: string, isGathering: boolean) => void;

    // Bootstrap
    bootstrap: () => void;

    // Actions
    startGathering: (resourceKey: string) => void;
    resetGatherProgress: (resourceKey: string) => void;

    // Initialize resource
    initializeResource: (resourceKey: string) => void;

    // Game loop
    startGameLoop: () => void;
    stopGameLoop: () => void;
    gameTick: () => void;

    // Player stats management
    getPlayerStats: () => PlayerStats;
    setPlayerStats: (stats: Partial<PlayerStats>) => void;
    updatePlayerWarmth: (timeOfDay: number) => void;
    drinkWater: () => void;

    // Time management
    getTimeOfDay: () => number;
    getDay: () => number;
    setTimeOfDay: (timeOfDay: number) => void;
    setDay: (day: number) => void;
    advanceTime: () => void;

    // Crafting management
    getCraftingRecipes: () => CraftingRecipe[];
    canCraftRecipe: (recipeId: string) => boolean;
    craftRecipe: (recipeId: string) => boolean;
    unlockRecipe: (recipeId: string) => void;
}

export type GameStore = GameState & GameActions;