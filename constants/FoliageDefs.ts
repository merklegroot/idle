
export type FoliageId =
    'invalid' |
    'empty' |
    'tree' |
    'rock' |
    'berry-bush';

export interface FoliageDef {
    id: FoliageId;
    name: string;
    icon: string;
};

const treeDef: FoliageDef = {
    id: 'tree',
    name: 'Tree',
    icon: '🌳'
};

const rockDef: FoliageDef = {
    id: 'rock',
    name: 'Rock',
    icon: '🪨'
};

const berryBushDef: FoliageDef = {
    id: 'berry-bush',
    name: 'Berry Bush',
    icon: '🫐'
};

export const FOLIAGE_DEFS: FoliageDef[] = [
    treeDef,
    rockDef,
    berryBushDef,
];