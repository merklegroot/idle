import { ResourceDef } from "@/constants/ResourceDefs";
import { FOLIAGE_DEFS, FoliageId } from "@/constants/FoliageDefs";
import { RESOURCE_DEFS, DefaultResourceColorClass } from "@/constants/ResourceDefs";
import { TERRAIN_DEFS } from "@/constants/TerrainDefs";
import { CRAFTING_RECIPES, CraftingIngredient } from "@/constants/CraftingRecipeDefs";
import { CraftingRecipeDef } from "@/constants/CraftingRecipeDefs";
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

function getFoliageTypeText(foliageType: FoliageId | null | undefined) {
  if (foliageType === 'invalid' || foliageType === 'empty' || !foliageType) return 'None';

  const foliageDef = FOLIAGE_DEFS.find(f => f.id === foliageType);
  return foliageDef?.name || '❓';
}

function getFoliageTypeIcon(foliageType: FoliageId | null | undefined) {
  if (foliageType === 'invalid' || foliageType === 'empty' || !foliageType) return null;

  const foliageDef = FOLIAGE_DEFS.find(f => f.id === foliageType);
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

function getResultingResourceIdFromActionId(actionId: ActionId): ResourceId | undefined {
  // not get gather -- make sure to account for crafting actions  
  const actionCategory = getActionCategory(actionId);
  if (actionCategory === ActionCategory.Gathering) {
    const actionDef = ALL_GATHER_ACTION_DEFS.find(g => g.id === actionId);
    if (!actionDef) return undefined;
    return actionDef.resultingResourceId;
  }
  
  if (actionCategory === ActionCategory.Crafting) {
    const recipe = CRAFTING_RECIPES.find(r => r.id === actionId);
    if (!recipe) return undefined;
    return recipe.resultingResourceId;
  }

  throw new Error(`Resulting resource id not found for action id: ${actionId}`);
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
    getActionCategory,
    getResultingResourceIdFromActionId
}