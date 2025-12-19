export type ResourceType = 'stick' | 'stone' | 'thatch' | 'water' | 'berry' | 
'twine' | 'rope' | 'cloth' | 'leather' | 'knapped-axe-head' | 'tool-handle';

const ResourceDisplayNameMap: Record<ResourceType, string> = {
    stick: 'Stick',
    stone: 'Stone',
    thatch: 'Thatch',
    water: 'Water',
    berry: 'Berries',
    twine: 'Twine',
    rope: 'Rope',
    cloth: 'Cloth',
    leather: 'Leather',
    'knapped-axe-head': 'Knapped Axe Head',
    'tool-handle': 'Tool Handle'
};

// New crafted component resources
ResourceDisplayNameMap['knapped-axe-head'] = 'Knapped Axe Head';

export function getResourceDisplayName(resourceType: ResourceType): string {
    return ResourceDisplayNameMap[resourceType];
}

const ResourceColorClassMap: Record<ResourceType, string> = {
    stick: 'text-green-800',
    stone: 'text-gray-800',
    thatch: 'text-yellow-800',
    water: 'text-blue-800',
    berry: 'text-purple-800',
    twine: 'text-amber-800',
    rope: 'text-orange-800',
    cloth: 'text-purple-800',
    leather: 'text-brown-800',
    'knapped-axe-head': 'text-gray-700',
    'tool-handle': 'text-gray-700'
};

export function getResourceColorClass(resourceType: ResourceType): string {
    return ResourceColorClassMap[resourceType] || 'text-gray-800';
}

// Color for newly added resource
// Using gray tone to indicate stone-based component
// @ts-ignore - extend map for runtime lookup
ResourceColorClassMap['knapped-axe-head'] = 'text-gray-700';