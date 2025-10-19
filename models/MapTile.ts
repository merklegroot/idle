import { TerrainEnum } from "./TerrainEnum";

export function parseTerrainType(terrainType: string): TerrainEnum {
    if (terrainType === 'g')
        return TerrainEnum.Grass;
    if (terrainType === 'p')
        return TerrainEnum.Path;
    if (terrainType === 'l')
        return TerrainEnum.HousingPlot;
    if (terrainType === 'w')
        return TerrainEnum.Water;

    return TerrainEnum.Invalid;
}

export interface MapTile {
    // type: 'g' | 'p' | 'l' | 'w'
    terrainType: TerrainEnum
    x: number
    y: number
    hasLeanTo?: boolean
}