import { BerryDef, StoneDef, WoodDef } from "@/app/models/ResourceDef";
import { GameState } from "./gameStoreModels";

// Helper function to get sell prices
// Helper function to check if materials are available (without consuming)
function checkMaterialsAvailable(resourceKey: string, state: GameState): boolean {
    const resourceDefs: Record<string, { materials?: Array<{ resourceKey: string; amount: number }> }> = {
        wood: WoodDef,
        berries: BerryDef,
        stone: StoneDef,
        hatchet: HatchetDef,
        pickaxe: PickaxeDef
    };

    const resourceDef = resourceDefs[resourceKey];
    if (!resourceDef?.materials) return true; // No materials required

    // Check if all required materials are available
    for (const material of resourceDef.materials) {
        const materialResource = state.resources[material.resourceKey];
        if (!materialResource || materialResource.amount < material.amount) {
            return false; // Not enough materials
        }
    }

    return true; // Materials available
};

// Helper function to check and consume materials
function checkAndConsumeMaterials(resourceKey: string, state: GameState): boolean {
    const resourceDefs: Record<string, { materials?: Array<{ resourceKey: string; amount: number }> }> = {
        wood: WoodDef,
        berries: BerryDef,
        stone: StoneDef,
        hatchet: HatchetDef,
        pickaxe: PickaxeDef
    };

    const resourceDef = resourceDefs[resourceKey];
    if (!resourceDef?.materials) return true; // No materials required

    // Check if all required materials are available
    for (const material of resourceDef.materials) {
        const materialResource = state.resources[material.resourceKey];
        if (!materialResource || materialResource.amount < material.amount) {
            return false; // Not enough materials
        }
    }

    // Consume materials
    for (const material of resourceDef.materials) {
        const materialResource = state.resources[material.resourceKey];
        if (materialResource) {
            materialResource.amount -= material.amount;
        }
    }

    return true; // Materials consumed successfully
};

export const gameStoreUtil = {
    checkMaterialsAvailable,
    checkAndConsumeMaterials
}