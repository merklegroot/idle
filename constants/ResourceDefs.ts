import { ResourceDef } from "@/app/models/ResourceDef";

export type ResourceType = 
    'wood' |
    'berry' |
    'stone' |
    'thatch' |
    'gold' |
    'stick' |
    'tool-handle' |
    'twine' |
    'knapped-axe-head' |
    'flimsy-axe' |
    'water';

export const DefaultResourceColorClass = 'text-gray-700';

export const resourceData: Record<ResourceType, ResourceDef> = {
    wood: {
        name: 'Wood',
        icon: '🪵',
        isGatherable: true,
        colorClass: 'text-green-800',
    },
    berry: {
        name: 'Berries',
        icon: '🫐',
        isGatherable: true,
        colorClass: 'text-purple-800',
    },
    stone: {
        name: 'Stone',
        icon: '🪨',
        isGatherable: true,
        colorClass: 'text-gray-800',
    },
    thatch: {
        name: 'Thatch',
        icon: '🌾',
        isGatherable: true,
        colorClass: 'text-yellow-800',
    },
    gold: {
        name: 'Gold',
        icon: '🪙',
        colorClass: 'text-gray-800',
    },
    stick: {
        name: 'Stick',
        icon: '╱',
        isGatherable: true,
        colorClass: 'text-green-800',
    },
    'tool-handle'   : {
        name: 'Tool Handle',
        icon: '🪥',
        colorClass: 'text-gray-700',
    },
    'twine': {
        name: 'Twine',
        icon: '🧵',
        colorClass: 'text-amber-800',
    },
    'knapped-axe-head': {
        name: 'Knapped Axe Head',
        icon: '🪨',
        colorClass: 'text-gray-700',
    },
    'flimsy-axe': {
        name: 'Flimsy Axe',
        icon: '🪓',
        colorClass: 'text-gray-700',
    },
    'water': {
        name: 'Water',
        icon: '💧',
        isGatherable: true,
        colorClass: 'text-blue-800',
    },
};

export const WoodDef: ResourceDef = resourceData.wood;
export const BerryDef: ResourceDef = resourceData.berry;
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
