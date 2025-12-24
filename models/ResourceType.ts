import { resourceUtil } from '@/utils/resourceUtil';

export function getResourceColorClass(resourceType: ResourceType | string): string {
  return resourceUtil.getResourceColorClass(resourceType as ResourceType);
}
