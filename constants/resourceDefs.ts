import { ResourceDef } from "@/app/models/ResourceDef";

const resourceData: Record<string, ResourceDef> = {
    wood: {
        name: 'Wood',
        resourceKey: 'wood',
        icon: '🪵',
        isGatherable: true,
    },
    berries: {
        name: 'Berries',
        resourceKey: 'berries',
        icon: '🫐',
        isGatherable: true,
    },
    stone: {
        name: 'Stone',
        resourceKey: 'stone',
        icon: '🪨',
        isGatherable: true,
    },
    thatch: {
        name: 'Thatch',
        resourceKey: 'thatch',
        icon: '🌾',
        isGatherable: true,
    },
    gold: {
        name: 'Gold',
        resourceKey: 'gold',
        icon: '🪙',
    },
    stick: {
        name: 'Stick',
        resourceKey: 'stick',
        icon: '╱',
        isGatherable: true,
    },
    'tool-handle'   : {
        name: 'Tool Handle',
        resourceKey: 'tool-handle',
        icon: '🪥',
    },
    'twine': {
        name: 'Twine',
        resourceKey: 'twine',
        icon: '🧵',
    },
    'knapped-axe-head': {
        name: 'Knapped Axe Head',
        resourceKey: 'knapped-axe-head',
        icon: '🪨',
    },
    'flimsy-axe': {
        name: 'Flimsy Axe',
        resourceKey: 'flimsy-axe',
        icon: '🪓',
    },
};

export const WoodDef: ResourceDef = resourceData.wood;
export const BerryDef: ResourceDef = resourceData.berries;
export const StoneDef: ResourceDef = resourceData.stone;
export const ThatchDef: ResourceDef = resourceData.thatch;
export const GoldDef: ResourceDef = resourceData.gold;
export const StickDef: ResourceDef = resourceData.stick;
export const HandleDef: ResourceDef = resourceData['tool-handle'];
export const TwineDef: ResourceDef = resourceData.twine;
export const KnappedAxeHeadDef: ResourceDef = resourceData['knapped-axe-head'];
export const ToolhandleDef: ResourceDef = resourceData['tool-handle'];
export const FlimsyAxeDef: ResourceDef = resourceData['flimsy-axe'];

export const ALL_RESOURCE_DEFS: ResourceDef[] = Object.values(resourceData) as ResourceDef[];
