'use client';

import { useState } from 'react';
import useGameStore from '../stores/gameStore';
import { WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef, GoldDef, ResourceDef } from '../app/models/ResourceDef';
import InventoryItem from './InventoryItem';
import ItemDetails from './ItemDetails';

export default function Inventory() {
  const { getResource } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  interface resouceInventoryItemDef {
    key: string;
    name: string;
    icon: string;
  }

  function toResourceInventoryItemDef(resourceDef: ResourceDef): resouceInventoryItemDef {
    return {
      key: resourceDef.resourceKey,
      name: resourceDef.name,
      icon: resourceDef.icon
    };
  }
  
  const resources = [
    toResourceInventoryItemDef(WoodDef),
    toResourceInventoryItemDef(BerryDef),
    toResourceInventoryItemDef(StoneDef),
    toResourceInventoryItemDef(HatchetDef),
    toResourceInventoryItemDef(PickaxeDef),
    toResourceInventoryItemDef(GoldDef)
  ];

  const inventoryItems = resources.map(resource => {
    const resourceData = getResource(resource.key);
    return {
      ...resource,
      amount: resourceData?.amount || 0
    };
  }).filter(item => item.amount > 0);

  return (
    <div className="flex gap-6">
      <div className="flex-1 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory</h2>
        
        {inventoryItems.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No items in inventory
          </div>
        ) : (
          <div className="space-y-3">
            {inventoryItems.map(item => (
              <InventoryItem
                key={item.key}
                resourceKey={item.key}
                name={item.name}
                icon={item.icon}
                amount={item.amount}
                onClick={() => setSelectedItem(item.key)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="w-80 bg-white rounded-lg p-6 border border-gray-200">
          <ItemDetails
            resourceKey={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      )}
    </div>
  );
}

