import { ResourceDef } from "@/app/models/ResourceDef";

export const DefaultResourceColorClass = 'text-gray-700';

const resourceData: Record<string, ResourceDef> = {
    wood: {
        name: 'Wood',
        resourceKey: 'wood',
        icon: '🪵',
        isGatherable: true,
        colorClass: 'text-green-800',
    },
    berries: {
        name: 'Berries',
        resourceKey: 'berries',
        icon: '🫐',
        isGatherable: true,
        colorClass: 'text-purple-800',
    },
    stone: {
        name: 'Stone',
        resourceKey: 'stone',
        icon: '🪨',
        isGatherable: true,
        colorClass: 'text-gray-800',
    },
    thatch: {
        name: 'Thatch',
        resourceKey: 'thatch',
        icon: '🌾',
        isGatherable: true,
        colorClass: 'text-yellow-800',
    },
    gold: {
        name: 'Gold',
        resourceKey: 'gold',
        icon: '🪙',
        colorClass: 'text-gray-800',
    },
    stick: {
        name: 'Stick',
        resourceKey: 'stick',
        icon: '╱',
        isGatherable: true,
        colorClass: 'text-green-800',
    },
    'tool-handle'   : {
        name: 'Tool Handle',
        resourceKey: 'tool-handle',
        icon: '🪥',
        colorClass: 'text-gray-700',
    },
    'twine': {
        name: 'Twine',
        resourceKey: 'twine',
        icon: '🧵',
        colorClass: 'text-amber-800',
    },
    'knapped-axe-head': {
        name: 'Knapped Axe Head',
        resourceKey: 'knapped-axe-head',
        icon: '🪨',
        colorClass: 'text-gray-700',
    },
    'flimsy-axe': {
        name: 'Flimsy Axe',
        resourceKey: 'flimsy-axe',
        icon: '🪓',
        colorClass: 'text-gray-700',
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
