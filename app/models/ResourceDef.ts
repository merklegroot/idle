export interface ResourceDef {
    name: string;
    resourceKey: string;
    icon: string;
    sellPrice?: number;
};

export interface GatherableResourceDef extends ResourceDef {
    perSecond: number;
    workerCost: number;
    workerSalary: number;
    workerPerSecond: number;
    gatherPerSecond: number;
    gatherInterval: number;
};

export const WoodDef: GatherableResourceDef = {
    name: 'Wood',
    resourceKey: 'wood',
    icon: '🪵',
    perSecond: 1,
    workerCost: 100, // Increased from 10 to 100
    workerSalary: 10, // Each worker costs 10 gold per second
    workerPerSecond: 1, // Each worker produces 1 wood per second
    gatherPerSecond: 2, // 2% per 20ms = 100% per 1000ms = 1 second
    gatherInterval: 20,
    sellPrice: 20 // Increased from 2 to 20
};

export const BerryDef: GatherableResourceDef = {
    name: 'Berries',
    resourceKey: 'berries',
    icon: '🫐',
    perSecond: 1,
    workerCost: 50, // Increased from 5 to 50
    workerSalary: 5, // Each worker costs 5 gold per second
    workerPerSecond: 1, // Same production rate as wood
    gatherPerSecond: 1.5, // Slower manual gathering (1.5% per 20ms = 1.33 seconds)
    gatherInterval: 20,
    sellPrice: 30 // Increased from 3 to 30
};

export const StoneDef: GatherableResourceDef = {
    name: 'Stone',
    resourceKey: 'stone',
    icon: '🪨',
    perSecond: 1,
    workerCost: 200, // Most expensive to hire
    workerSalary: 15, // Highest salary cost
    workerPerSecond: 1, // Same production rate
    gatherPerSecond: 1, // Slowest manual gathering (1% per 20ms = 2 seconds)
    gatherInterval: 20,
    sellPrice: 50 // Most valuable to sell
};

export const GoldDef: ResourceDef = {
    name: 'Gold',
    resourceKey: 'gold',
    icon: '🪙',
};