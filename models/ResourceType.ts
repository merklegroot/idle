export type ResourceType = 'stick' | 'stone' | 'thatch' | 'water' | 'twine' | 'rope' | 'cloth' | 'leather';

const ResourceDisplayNameMap: Record<ResourceType, string> = {
    stick: 'Stick',
    stone: 'Stone',
    thatch: 'Thatch',
    water: 'Water',
    twine: 'Twine',
    rope: 'Rope',
    cloth: 'Cloth',
    leather: 'Leather'
};

export function getResourceDisplayName(resourceType: ResourceType): string {
    return ResourceDisplayNameMap[resourceType];
}

const ResourceColorClassMap: Record<ResourceType, string> = {
    stick: 'text-green-800',
    stone: 'text-gray-800',
    thatch: 'text-yellow-800',
    water: 'text-blue-800',
    twine: 'text-amber-800',
    rope: 'text-orange-800',
    cloth: 'text-purple-800',
    leather: 'text-brown-800'
};

export function getResourceColorClass(resourceType: ResourceType): string {
    return ResourceColorClassMap[resourceType] || 'text-gray-800';
}