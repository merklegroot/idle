import { ResourceId } from "./ResourceDefs";

export type GatherActionId = 'gather-stick' | 'gather-stone' | 'gather-thatch' | 'gather-berry' | 'gather-water';

export interface GatherActionDef {
  id: GatherActionId;
  displayName: string;
  resultingResourceId: ResourceId;
};

const GatherStickAction: GatherActionDef = {
  id: 'gather-stick',
  displayName: 'Gather Stick',
  resultingResourceId: 'stick'
};

const GatherStoneAction: GatherActionDef = {
  id: 'gather-stone',
  displayName: 'Gather Stone',
  resultingResourceId: 'stone'
};

const GatherThatchAction: GatherActionDef = {
  id: 'gather-thatch',
  displayName: 'Gather Thatch',
  resultingResourceId: 'thatch'
};

const GatherBerryAction: GatherActionDef = {
  id: 'gather-berry',
  displayName: 'Gather Berry',
  resultingResourceId: 'berry'
};

const GatherWaterAction: GatherActionDef = {
  id: 'gather-water',
  displayName: 'Gather Water',
  resultingResourceId: 'water'
};

export const GatherDefs = {
  Stick: GatherStickAction,
  Stone: GatherStoneAction,
  Thatch: GatherThatchAction,
  Berry: GatherBerryAction,
  Water: GatherWaterAction
}

export const ALL_GATHER_ACTION_DEFS: GatherActionDef[] = [
  GatherStickAction,
  GatherStoneAction,
  GatherThatchAction,
  GatherBerryAction,
  GatherWaterAction
];
