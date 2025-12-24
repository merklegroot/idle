import { TerrainEnum } from "@/models/TerrainEnum";

export interface TerrainDef {
    name: string;
    icon: string;
}

export const TERRAIN_DEFS: Partial<Record<TerrainEnum, TerrainDef>> = {
    [TerrainEnum.Grass]: {
        name: 'Grass',
        icon: '🌱'
    },
    [TerrainEnum.Path]: {
        name: 'Path',
        icon: '🌱'
    },
    [TerrainEnum.HousingPlot]: {
        name: 'Housing',
        icon: '🌱'
    },
    [TerrainEnum.Water]: {
        name: 'Water',
        icon: '🌱'
    }
};
