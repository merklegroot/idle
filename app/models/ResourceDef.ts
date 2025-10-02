export interface ResourceDef {
    name: string;
    resourceKey: string;
    icon: string;
    sellPrice?: number;
};

export interface GatherableResourceDef extends ResourceDef {
    perSecond: number;
    workerCost: number;
    workerPerSecond: number;
    gatherPerSecond: number;
    gatherInterval: number;
};

export const WoodDef: GatherableResourceDef = {
    name: 'Wood',
    resourceKey: 'wood',
    icon: '🪵',
    perSecond: 1,
    workerCost: 10,
    workerPerSecond: 1, // Each worker produces 1 wood per second
    gatherPerSecond: 2, // 2% per 20ms = 100% per 1000ms = 1 second
    gatherInterval: 20,
    sellPrice: 2
};

export const BerryDef: GatherableResourceDef = {
    name: 'Berries',
    resourceKey: 'berries',
    icon: '🫐',
    perSecond: 1,
    workerCost: 5, // Cheaper than wood workers
    workerPerSecond: 1, // Same production rate as wood
    gatherPerSecond: 1.5, // Slower manual gathering (1.5% per 20ms = 1.33 seconds)
    gatherInterval: 20,
    sellPrice: 3
};

export const GoldDef: ResourceDef = {
    name: 'Gold',
    resourceKey: 'gold',
    icon: '🪙',
};