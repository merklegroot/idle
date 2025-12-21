import { FoliageEnum } from "@/models/FoliageEnum";

export interface FoliageDef {
    name: string;
    icon: string;
}


export const FOLIAGE_DEFS: Partial<Record<FoliageEnum, FoliageDef>> = {
    [FoliageEnum.Tree]: {
        name: 'Tree',
        icon: '🌳'
    },
    [FoliageEnum.Rock]: {
        name: 'Rock',
        icon: '🪨'
    },
    [FoliageEnum.BerryBush]: {
        name: 'Berry Bush',
        icon: '🫐'
    }
};