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
    gatherPerSecond: 2, // 2% per 20ms = 100% per 1000ms = 1 second
    gatherInterval: 20
};