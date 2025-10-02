'use client';

import { useState } from 'react';
import useGameStore from '../stores/gameStore';
import { WoodDef, BerryDef } from '../app/models/ResourceDef';

interface InventoryItemProps {
  resourceKey: string;
  name: string;
  icon: string;
  amount: number;
  onClick: () => void;
}

function InventoryItem({ resourceKey, name, icon, amount, onClick }: InventoryItemProps) {
  if (amount === 0) return null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3"
    >
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-500">{amount.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const { getResource } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const resources = [
    { key: 'wood', name: WoodDef.name, icon: WoodDef.icon },
    { key: 'berries', name: BerryDef.name, icon: BerryDef.icon }
  ];

  const inventoryItems = resources.map(resource => {
    const resourceData = getResource(resource.key);
    return {
      ...resource,
      amount: resourceData?.amount || 0
    };
  }).filter(item => item.amount > 0);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
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

      {selectedItem && (
        <ItemDetails
          resourceKey={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

function ItemDetails({ resourceKey, onClose }: { resourceKey: string; onClose: () => void }) {
  const { getResource, sellResource, sellResourcePercentage, sellAllResource } = useGameStore();
  const [customAmount, setCustomAmount] = useState('');

  const resource = getResource(resourceKey);
  if (!resource) return null;

  const resourceDefs: Record<string, { name: string; icon: string }> = {
    wood: { name: WoodDef.name, icon: WoodDef.icon },
    berries: { name: BerryDef.name, icon: BerryDef.icon }
  };

  const resourceDef = resourceDefs[resourceKey];
  if (!resourceDef) return null;

  const sellPrice = resourceKey === 'wood' ? 2 : 1;

  const handleCustomSell = () => {
    const amount = parseInt(customAmount);
    if (amount > 0 && amount <= resource.amount) {
      sellResource(resourceKey, amount);
      setCustomAmount('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{resourceDef.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{resourceDef.name}</h3>
              <p className="text-gray-500">Quantity: {resource.amount.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-4">
            Sell price: {sellPrice} gold each
          </div>

          <button
            onClick={() => sellResource(resourceKey, 1)}
            disabled={resource.amount < 1}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
          >
            Sell 1 ({sellPrice} gold)
          </button>

          <button
            onClick={() => sellResourcePercentage(resourceKey, 10)}
            disabled={resource.amount < 1}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
          >
            Sell 10% ({Math.floor(resource.amount * 0.1)} items)
          </button>

          <button
            onClick={() => sellAllResource(resourceKey)}
            disabled={resource.amount < 1}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
          >
            Sell All ({resource.amount} items)
          </button>

          <div className="flex gap-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Custom amount"
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max={resource.amount}
            />
            <button
              onClick={handleCustomSell}
              disabled={!customAmount || parseInt(customAmount) < 1 || parseInt(customAmount) > resource.amount}
              className="py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
