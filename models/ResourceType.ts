export type ResourceType = 'stick' | 'stone' | 'thatch' | 'water';

const ResourceDisplayNameMap: Record<ResourceType, string> = {
    stick: 'Stick',
    stone: 'Stone',
    thatch: 'Thatch',
    water: 'Water'
};

export function getResourceDisplayName(resourceType: ResourceType): string {
    return ResourceDisplayNameMap[resourceType];
}

const ResourceColorClassMap: Record<ResourceType, string> = {
    stick: 'text-green-800',
    stone: 'text-gray-800',
    thatch: 'text-yellow-800',
    water: 'text-blue-800'
};

export function getResourceColorClass(resourceType: ResourceType): string {
    return ResourceColorClassMap[resourceType] || 'text-gray-800';
}