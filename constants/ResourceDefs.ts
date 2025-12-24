export type ResourceId = 
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

export interface ResourceDef {
    id: string;
    displayName: string;
    icon: string;
    colorClass?: string;
    isGatherable?: boolean;
}; 

export const DefaultResourceColorClass = 'text-gray-700';

const woodDef: ResourceDef = {
    id: 'wood',
    displayName: 'Wood',
    icon: '🪵',
    isGatherable: true,
    colorClass: 'text-green-800',
}

const berryDef: ResourceDef = {
    id: 'berry',
    displayName: 'Berries',
    icon: '🫐',
    isGatherable: true,
    colorClass: 'text-purple-800',
}

const stoneDef: ResourceDef = {
    id: 'stone',
    displayName: 'Stone',
    icon: '🪨',
    isGatherable: true,
    colorClass: 'text-gray-800',
}

const thatchDef: ResourceDef = {
    id: 'thatch',
    displayName: 'Thatch',
    icon: '🌾',
    isGatherable: true,
    colorClass: 'text-yellow-800',
}

const goldDef: ResourceDef = {
    id: 'gold',
    displayName: 'Gold',
    icon: '🪙',
    colorClass: 'text-gray-800',
}

const stickDef: ResourceDef = {
    id: 'stick',
    displayName: 'Stick',
    icon: '╱',
    isGatherable: true,
    colorClass: 'text-green-800',
}

const toolHandleDef: ResourceDef = {
    id: 'tool-handle',
    displayName: 'Tool Handle',
    icon: '🪥',
    colorClass: 'text-gray-700',
}

const twineDef: ResourceDef = {
    id: 'twine',
    displayName: 'Twine',
    icon: '🧵',
    colorClass: 'text-amber-800',
}

const knappedAxeHeadDef: ResourceDef = {
    id: 'knapped-axe-head',
    displayName: 'Knapped Axe Head',
    icon: '🪨',
    colorClass: 'text-gray-700',
}

const flimsyAxeDef: ResourceDef = {
    id: 'flimsy-axe',
    displayName: 'Flimsy Axe',
    icon: '🪓',
    colorClass: 'text-gray-700',
}

const waterDef: ResourceDef = {
    id: 'water',
    displayName: 'Water',
    icon: '💧',
    isGatherable: true,
    colorClass: 'text-blue-800',
}
export const RESOURCE_DEFS: ResourceDef[] = [
    woodDef,
    berryDef,
    stoneDef,
    thatchDef,
    goldDef,
    stickDef,
    toolHandleDef,
    twineDef,
    knappedAxeHeadDef,
    flimsyAxeDef,
    waterDef,
]