export interface ResourceDef {
    name: string;
    resourceKey: string;
    icon: string;
    sellPrice?: number;
};

export interface MaterialRequirement {
    resourceKey: string;
    amount: number;
}

export interface GatherableResourceDef extends ResourceDef {
    perSecond: number;
    workerCost: number;
    workerSalary: number;
    workerPerSecond: number;
    gatherPerSecond: number;
    gatherInterval: number;
    materials?: MaterialRequirement[];
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

export const HatchetDef: GatherableResourceDef = {
    name: 'Hatchet',
    resourceKey: 'hatchet',
    icon: '🪓',
    perSecond: 1,
    workerCost: 300, // More expensive than stone
    workerSalary: 20, // Higher salary cost
    workerPerSecond: 1, // Same production rate
    gatherPerSecond: 0.8, // Slowest manual gathering (0.8% per 20ms = 2.5 seconds)
    gatherInterval: 20,
    sellPrice: 75, // Most valuable to sell
    materials: [
        { resourceKey: 'wood', amount: 2 },
        { resourceKey: 'stone', amount: 1 }
    ]
};

export const PickaxeDef: GatherableResourceDef = {
    name: 'Pickaxe',
    resourceKey: 'pickaxe',
    icon: '⛏️',
    perSecond: 1,
    workerCost: 500, // Most expensive to hire
    workerSalary: 25, // Highest salary cost
    workerPerSecond: 1, // Same production rate
    gatherPerSecond: 0.6, // Slowest manual gathering (0.6% per 20ms = 3.33 seconds)
    gatherInterval: 20,
    sellPrice: 100, // Most valuable to sell
    materials: [
        { resourceKey: 'wood', amount: 3 },
        { resourceKey: 'stone', amount: 2 }
    ]
};

export const GoldDef: ResourceDef = {
    name: 'Gold',
    resourceKey: 'gold',
    icon: '🪙',
};

export const HouseDef: ResourceDef = {
    name: 'House',
    resourceKey: 'house',
    icon: '🏠',
};

export const TownHallDef: ResourceDef = {
    name: 'Town Hall',
    resourceKey: 'townHall',
    icon: '🏛️',
};

// Tool categories
export type ToolCategory = 'axe' | 'pickaxe';

// Tool category mapping
export const toolCategories: Record<string, ToolCategory> = {
    hatchet: 'axe',
    pickaxe: 'pickaxe'
};

// Equipment interface supporting multiple tool categories
export interface CharacterEquipment {
    axe?: string; // resourceKey of equipped axe tool (hatchet)
    pickaxe?: string; // resourceKey of equipped pickaxe tool (pickaxe)
}

// Tool effectiveness mapping
export const toolEffectiveness: Record<string, string[]> = {
    hatchet: ['wood'], // Hatchet helps with wood
    pickaxe: ['stone'] // Pickaxe helps with stone
};

// Tool bonus percentages
export const toolBonuses: Record<string, number> = {
    hatchet: 50, // 50% faster wood gathering
    pickaxe: 50  // 50% faster stone gathering
};