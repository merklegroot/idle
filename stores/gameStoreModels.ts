
export interface ResourceState {
    quantity: number;
    perSecond: number;
    workers: number;
    paidWorkers: number;
    isGathering: boolean;
    gatherProgress: number;
    workerProgress: number;
    autoSellThreshold: number;
    autoSellEnabled: boolean;
}

export interface PlayerStats {
    health: number;
    warmth: number;
    food: number;
    hydration: number;
}

export interface GameState {
    resources: Record<string, ResourceState>;
    playerStats: PlayerStats;
    timeOfDay: number; // 0-24 hours
    day: number;
}

export interface GameActions {
    // Resource management
    getResource: (resourceKey: string) => ResourceState | undefined;
    setResourceQuantity: (resourceKey: string, quantity: number) => void;
    addResourceQuantity: (resourceKey: string, quantity: number) => void;
    setResourcePerSecond: (resourceKey: string, perSecond: number) => void;
    setResourceIsGathering: (resourceKey: string, isGathering: boolean) => void;

    // Bootstrap
    bootstrap: () => void;

    // Reset
    reset: () => void;

    // Actions
    startGathering: (resourceKey: string) => void;
    resetGatherProgress: (resourceKey: string) => void;

    // Initialize resource
    initializeResource: (resourceKey: string) => void;

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
    canCraftRecipe: (recipeId: string) => boolean;
    craftRecipe: (recipeId: string) => boolean;
}

export type GameStore = GameState & GameActions;