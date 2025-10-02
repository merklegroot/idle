'use client';

import { useState } from 'react';
import useGameStore from '../stores/gameStore';
import { WoodDef, BerryDef } from '../app/models/ResourceDef';

interface ItemDetailsProps {
  resourceKey: string;
  onClose: () => void;
}

export default function ItemDetails({ resourceKey, onClose }: ItemDetailsProps) {
  const { getResource, sellResource, sellResourcePercentage, sellAllResource, setAutoSellThreshold, setAutoSellEnabled } = useGameStore();
  const [customAmount, setCustomAmount] = useState('');
  const [autoSellThreshold, setAutoSellThresholdInput] = useState('');

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

        <div className="border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Auto-Sell Settings</h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoSellEnabled"
                checked={resource.autoSellEnabled}
                onChange={(e) => setAutoSellEnabled(resourceKey, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="autoSellEnabled" className="text-sm font-medium text-gray-700">
                Enable Auto-Sell
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={autoSellThreshold}
                onChange={(e) => setAutoSellThresholdInput(e.target.value)}
                placeholder="Keep amount"
                className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                disabled={!resource.autoSellEnabled}
              />
              <button
                onClick={() => {
                  const threshold = parseInt(autoSellThreshold);
                  if (threshold >= 0) {
                    setAutoSellThreshold(resourceKey, threshold);
                    setAutoSellThresholdInput('');
                  }
                }}
                disabled={!resource.autoSellEnabled || !autoSellThreshold || parseInt(autoSellThreshold) < 0}
                className="py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
              >
                Set
              </button>
            </div>

            {resource.autoSellEnabled && resource.autoSellThreshold > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-sm text-orange-800">
                  <strong>Auto-sell active:</strong> Will automatically sell excess items when quantity exceeds {resource.autoSellThreshold.toLocaleString()}
                </div>
                <div className="text-xs text-orange-700 mt-1">
                  Current threshold: {resource.autoSellThreshold.toLocaleString()} items
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
