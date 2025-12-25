import { ResourceId } from "./ResourceDefs";

export type GatherActionId = 'gather-stick' | 'gather-stone' | 'gather-thatch' | 'gather-berry' | 'gather-water';

export interface GatherActionDef {
  id: GatherActionId;
  displayName: string;
  resultingResourceId: ResourceId;
};

export const GATHER_ACTION_DEFS: GatherActionDef[] = [
  { id: 'gather-stick', displayName: 'Gather Stick', resultingResourceId: 'stick' },
  { id: 'gather-stone', displayName: 'Gather Stone', resultingResourceId: 'stone' },
  { id: 'gather-thatch', displayName: 'Gather Thatch', resultingResourceId: 'thatch' },
  { id: 'gather-berry', displayName: 'Gather Berry', resultingResourceId: 'berry' },
  { id: 'gather-water', displayName: 'Gather Water', resultingResourceId: 'water' }
];
