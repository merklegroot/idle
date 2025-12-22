import { ResourceDef } from "@/app/models/ResourceDef";
import { FOLIAGE_DEFS } from "@/constants/FoliageDefs";
import { ALL_RESOURCE_DEFS } from "@/constants/resourceDefs";
import { TERRAIN_DEFS } from "@/constants/terrainDefs";
import { CraftingIngredient, CraftingRecipe } from "@/models/CraftingRecipe";
import { FoliageEnum } from "@/models/FoliageEnum";
import { ResourceType } from "@/models/ResourceType";
import { TerrainEnum } from "@/models/TerrainEnum";

function getResourceDef(resourceType: ResourceType) : ResourceDef | undefined {
  return ALL_RESOURCE_DEFS.find(def => def.resourceKey === resourceType);
}

function getResourceDisplayName(resourceType: ResourceType): string {
  return getResourceDef(resourceType)?.name || 'Unknown';
}

function getResourceIcon(resourceKey: ResourceType): string {
  const resourceIconMap = ALL_RESOURCE_DEFS.reduce((map: Record<string, string>, def: ResourceDef) => {
    map[def.resourceKey] = def.icon;
    return map;
  }, {} as Record<string, string>);
  return resourceIconMap[resourceKey as string] || `${resourceKey as string} not found
  ❓`;
}

function getRecipeIcon(recipe: CraftingRecipe): string {
  return getResourceIcon(recipe.result.resourceKey);
}

function getIngredientIcon(ingredient: CraftingIngredient): string {
  return getResourceIcon(ingredient.resourceKey);
}

function getTileTypeText(terrainType: TerrainEnum | undefined | null) {
  if (!terrainType) return 'None';

  const terrainDef = TERRAIN_DEFS[terrainType as TerrainEnum];
  return terrainDef?.name || '❓';
}

function getTileTypeIcon(terrainType: TerrainEnum | undefined | null) {
  if (!terrainType) return 'None';

  const terrainDef = TERRAIN_DEFS[terrainType as TerrainEnum];
  return terrainDef?.icon || '❓';
}

function getFoliageTypeText(foliageType: FoliageEnum | null | undefined) {
  if (!foliageType) return 'None';

  const foliageDef = FOLIAGE_DEFS[foliageType as FoliageEnum];
  return foliageDef?.name || '❓';
}

function getFoliageTypeIcon(foliageType: FoliageEnum | null | undefined) {
  if (!foliageType) return 'None';

  const foliageDef = FOLIAGE_DEFS[foliageType as FoliageEnum];
  return foliageDef?.icon || '❓';
}

function getActionVerb(resourceType: ResourceType): string {
  const resourceDef = ALL_RESOURCE_DEFS.find(def => def.resourceKey === resourceType);
  if (!resourceDef) throw new Error(`ResourceDef not found for resourceType: ${resourceType}`);

  return resourceDef.isGatherable
      ? 'Gathering'
      : 'Crafting';  
}

export const resourceUtil = {
    getRecipeIcon,
    getIngredientIcon,
    getTileTypeText,
    getTileTypeIcon,
    getFoliageTypeText,
    getFoliageTypeIcon,
    getActionVerb,
    getResourceDef,
    getResourceDisplayName
}