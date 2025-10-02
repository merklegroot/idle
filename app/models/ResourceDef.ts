export interface ResourceDef {
    name: string;
    icon: string;
    perSecond: number;
    workerCost: number;
    workerPerSecond: number;
    gatherPerSecond: number;
    gatherInterval: number;
};

export const WoodDef: ResourceDef = {
    name: 'Wood',
    icon: '🪵',
    perSecond: 1,
    workerCost: 10,
    workerPerSecond: 0.4,
    gatherPerSecond: 2,
    gatherInterval: 20
};