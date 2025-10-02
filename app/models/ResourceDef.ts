export interface ResourceDef {
    name: string;
    resourceKey: string;
    icon: string;
    perSecond: number;
    workerCost: number;
    workerPerSecond: number;
    gatherPerSecond: number;
    gatherInterval: number;
};

export const WoodDef: ResourceDef = {
    name: 'Wood',
    resourceKey: 'wood',
    icon: '🪵',
    perSecond: 1,
    workerCost: 10,
    workerPerSecond: 1, // Each worker produces 1 wood per second
    gatherPerSecond: 2,
    gatherInterval: 20
};