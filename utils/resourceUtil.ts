import { KnappedAxeHeadDef, BerryDef, GoldDef, TwineDef, StickDef, ResourceDef, StoneDef, WoodDef, ThatchDef } from "@/app/models/ResourceDef";
import { CraftingIngredient, CraftingRecipe } from "@/models/CraftingRecipe";

function getResourceIcon(resourceKey: string): string {
  const resourceDefs: ResourceDef[] = [WoodDef, BerryDef, StoneDef, GoldDef, StickDef, ThatchDef, TwineDef, KnappedAxeHeadDef];
  const resourceIconMap = resourceDefs.reduce((map: Record<string, string>, def: ResourceDef) => {
    map[def.resourceKey] = def.icon;
    return map;
  }, {} as Record<string, string>);
  return resourceIconMap[resourceKey as string] || '❓';
}

function getRecipeIcon(recipe: CraftingRecipe): string {
  return getResourceIcon(recipe.result.resourceKey);
}

function getIngredientIcon(ingredient: CraftingIngredient): string {
  return getResourceIcon(ingredient.resourceKey);
}


function getTileTypeText(terrainType: TerrainEnum | undefined | null) {
  if (terrainType === TerrainEnum.Grass)
    return 'Grass';

  if (terrainType === TerrainEnum.Path)
    return 'Path';

  if (terrainType === TerrainEnum.HousingPlot)
    return 'Housing Plot';

  if (terrainType === TerrainEnum.Water)
    return 'Water';

  return 'Unknown';
}

function getTileTypeIcon(terrainType: TerrainEnum | undefined | null) {
  if (terrainType === TerrainEnum.Grass)
    return '🌱';

  if (terrainType === TerrainEnum.Path)
    return '🛤️';

  if (terrainType === TerrainEnum.HousingPlot)
    return '🏠';

  if (terrainType === TerrainEnum.Water)
    return '🌊';

  return '❓';
}

function getFoliageTypeText(foliageType: string | null | undefined) {
  if (!foliageType) return 'None';
  
  switch (foliageType.toLowerCase()) {
    case 'tree':
      return 'Tree';
    case 'rock':
      return 'Rock';
    case 'berrybush':
      return 'Berry Bush';
    case 'empty':
      return 'None';
    default:
      return foliageType;
  }
}

function getFoliageTypeIcon(foliageType: string | null | undefined) {
  if (!foliageType) return '';
  
  switch (foliageType.toLowerCase()) {
    case 'tree':
      return '🌳';
    case 'rock':
      return '🪨';
    case 'berrybush':
      return '🫐';
    case 'empty':
      return '';
    default:
      return '🌿';
  }
}

export const resourceUtil = {
    getRecipeIcon,
    getIngredientIcon,
    getTileTypeText,
    getTileTypeIcon,
    getFoliageTypeText,
    getFoliageTypeIcon
}