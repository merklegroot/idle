import { BerryDef, HatchetDef, PickaxeDef, StoneDef, WoodDef } from "@/app/models/ResourceDef";
import { GameState } from "./gameStoreModels";

// Helper function to get sell prices
function getSellPrice(resourceKey: string): number {
    const prices: Record<string, number> = {
        wood: WoodDef.sellPrice || 20,    // Wood sells for 20 gold each
        berries: BerryDef.sellPrice || 30,  // Berries sell for 30 gold each
        stone: StoneDef.sellPrice || 50,   // Stone sells for 50 gold each
        hatchet: HatchetDef.sellPrice || 75, // Hatchet sells for 75 gold each
        pickaxe: PickaxeDef.sellPrice || 100 // Pickaxe sells for 100 gold each
    };
    return prices[resourceKey] || 1;
};

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
    getSellPrice,
    checkMaterialsAvailable,
    checkAndConsumeMaterials
}