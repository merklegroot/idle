import { CraftingRecipeId } from "./CraftingRecipeDefs";
import { GatherActionId } from "./GatherDefs";

export type ActionId = CraftingRecipeId | GatherActionId;

export enum ActionCategory {
    Crafting,
    Gathering
}
