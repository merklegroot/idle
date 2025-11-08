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

export const resourceUtil = {
    getRecipeIcon,
    getIngredientIcon
}