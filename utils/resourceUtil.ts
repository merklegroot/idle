import { ResourceDef } from "@/constants/ResourceDefs";
import { FOLIAGE_DEFS } from "@/constants/FoliageDefs";
import { RESOURCE_DEFS, DefaultResourceColorClass } from "@/constants/ResourceDefs";
import { TERRAIN_DEFS } from "@/constants/TerrainDefs";
import { CRAFTING_RECIPES, CraftingIngredient } from "@/constants/CraftingRecipeDefs";
import { CraftingRecipeDef } from "@/constants/CraftingRecipeDefs";
import { FoliageEnum } from "@/models/FoliageEnum";
import { ResourceId } from "@/constants/ResourceDefs";
import { TerrainEnum } from "@/models/TerrainEnum";
import { ActionCategory, ActionId } from "@/constants/ActionDefs";
import { ALL_GATHER_ACTION_DEFS } from "@/constants/GatherDefs";

function getResourceDef(resourceType: ResourceId) : ResourceDef | undefined {
  return RESOURCE_DEFS.find(def => def.id === resourceType);
}

function getResourceDisplayName(resourceType: ResourceId): string {
  return getResourceDef(resourceType)?.displayName || 'Unknown';
}

function getResourceIcon(resourceKey: ResourceId): string {
  const resourceIconMap = RESOURCE_DEFS.reduce((map: Record<string, string>, def: ResourceDef) => {
    map[def.id] = def.icon;
    return map;
  }, {} as Record<string, string>);
  return resourceIconMap[resourceKey as string] || `${resourceKey as string} not found
  ❓`;
}

function getRecipeIcon(recipe: CraftingRecipeDef): string {
  return getResourceIcon(recipe.resultingResourceId);
}

function getIngredientIcon(ingredient: CraftingIngredient): string {
  return getResourceIcon(ingredient.resourceId);
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

function getActionCategory(actionId: ActionId): ActionCategory {
  if (ALL_GATHER_ACTION_DEFS.some(g => g.id === actionId)) return ActionCategory.Gathering;
  if (CRAFTING_RECIPES.some(r => r.id === actionId)) return ActionCategory.Crafting;

  throw new Error(`Action category not found for action id: ${actionId}`);
}

function getFoliageTypeText(foliageType: FoliageEnum | null | undefined) {
  if (!foliageType || foliageType === FoliageEnum.Invalid || foliageType === FoliageEnum.Empty) return 'None';

  const foliageDef = FOLIAGE_DEFS[foliageType as FoliageEnum];
  return foliageDef?.name || '❓';
}

function getFoliageTypeIcon(foliageType: FoliageEnum | null | undefined) {
  if (!foliageType || foliageType === FoliageEnum.Invalid || foliageType === FoliageEnum.Empty) return null;

  const foliageDef = FOLIAGE_DEFS[foliageType as FoliageEnum];
  return foliageDef?.icon || '❓';
}

function getActionVerb(resourceType: ResourceId): string {
  const resourceDef = RESOURCE_DEFS.find(def => def.id === resourceType);
  if (!resourceDef) throw new Error(`ResourceDef not found for resourceType: ${resourceType}`);

  return resourceDef.isGatherable
      ? 'Gathering'
      : 'Crafting';  
}

function getResourceColorClass(resourceType: ResourceId): string {
  const resourceDef = resourceUtil.getResourceDef(resourceType);
  return resourceDef?.colorClass || DefaultResourceColorClass;
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
    getResourceDisplayName,
    getResourceColorClass,
    getActionCategory
}