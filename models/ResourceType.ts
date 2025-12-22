import { resourceUtil } from '@/utils/resourceUtil';

export type ResourceType = 'stick' | 'stone' | 'thatch' | 'water' | 'berry' | 
'twine' | 'rope' | 'cloth' | 'leather' | 'knapped-axe-head' | 'tool-handle' | 'flimsy-axe';

export function getResourceColorClass(resourceType: ResourceType | string): string {
  return resourceUtil.getResourceColorClass(resourceType as ResourceType);
}
