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
    { key: 'berries', name: BerryDef.name, icon: BerryDef.icon },
    { key: 'gold', name: 'Gold', icon: '🪙' }
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

function ItemDetails({ resourceKey, onClose }: { resourceKey: string; onClose: () => void }) {
  const { getResource, sellResource, sellResourcePercentage, sellAllResource } = useGameStore();
  const [customAmount, setCustomAmount] = useState('');

  const resource = getResource(resourceKey);
  if (!resource) return null;

  const resourceDefs: Record<string, { name: string; icon: string }> = {
    wood: { name: WoodDef.name, icon: WoodDef.icon },
    berries: { name: BerryDef.name, icon: BerryDef.icon },
    gold: { name: 'Gold', icon: '🪙' }
  };

  const resourceDef = resourceDefs[resourceKey];
  if (!resourceDef) return null;

  // If it's gold, show currency info instead of sell options
  if (resourceKey === 'gold') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{resourceDef.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{resourceDef.name}</h3>
              <p className="text-gray-500">Amount: {resource.amount.toLocaleString()}</p>
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-800">
              <strong>Currency</strong>
            </div>
            <div className="text-sm text-yellow-700 mt-1">
              Gold is your currency. Use it to hire workers and make purchases.
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <div className="font-semibold mb-2">Sell Prices:</div>
            <div>• Wood: 2 gold each</div>
            <div>• Berries: 1 gold each</div>
          </div>
        </div>
      </div>
    );
  }

  const sellPrice = resourceKey === 'wood' ? 2 : 1;

  const handleCustomSell = () => {
    const amount = parseInt(customAmount);
    if (amount > 0 && amount <= resource.amount) {
      sellResource(resourceKey, amount);
      setCustomAmount('');
    }
  };

  return (
    <div>
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
  );
}
