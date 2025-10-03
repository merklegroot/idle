import { CharacterEquipment } from "../app/models/ResourceDef";

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

export interface GameState {
    resources: Record<string, ResourceState>;
    gameLoopInterval?: NodeJS.Timeout;
    tickCount: number;
    characterEquipment: CharacterEquipment;
    homes: Home[];
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

    // Home management
    buildHome: () => void;
    upgradeHome: (homeId: string) => void;
    getHomeCost: () => HomeCost;
    getHomeUpgradeCost: (homeId: string) => HomeCost;
    canBuildHome: () => boolean;
    canUpgradeHome: (homeId: string) => boolean;

    // Bootstrap
    bootstrap: () => void;

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

    // Equipment management
    equipTool: (toolKey: string) => void;
    unequipTool: (toolKey: string) => void;
    getEquippedTool: (toolKey: string) => string | undefined;
    getToolBonus: (resourceKey: string) => number;

    // Worker equipment management
    getWorkerToolBonus: (resourceKey: string) => number;
    getWorkersWithTools: (resourceKey: string) => number;

    // Game loop
    startGameLoop: () => void;
    stopGameLoop: () => void;
    gameTick: () => void;
}

export type GameStore = GameState & GameActions;