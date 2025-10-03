'use client';

import { useState, useEffect } from 'react';
import useGameStore from '../stores/gameStore';
import { WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef } from '../app/models/ResourceDef';
import { formattingUtil } from '@/utils/formattingUtil';

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

  // Update threshold input when resource changes
  useEffect(() => {
    setAutoSellThresholdInput(formattingUtil.formatNumber(resource.autoSellThreshold));
  }, [resource.autoSellThreshold]);

  const resourceDefs: Record<string, { name: string; icon: string; sellPrice?: number }> = {
    wood: { name: WoodDef.name, icon: WoodDef.icon, sellPrice: WoodDef.sellPrice },
    berries: { name: BerryDef.name, icon: BerryDef.icon, sellPrice: BerryDef.sellPrice },
    stone: { name: StoneDef.name, icon: StoneDef.icon, sellPrice: StoneDef.sellPrice },
    hatchet: { name: HatchetDef.name, icon: HatchetDef.icon, sellPrice: HatchetDef.sellPrice },
    pickaxe: { name: PickaxeDef.name, icon: PickaxeDef.icon, sellPrice: PickaxeDef.sellPrice },
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

          {/* <div className="text-sm text-gray-600">
            <div className="font-semibold mb-2">Sell Prices:</div>
            <div>• Wood: 2 gold each</div>
            <div>• Berries: 1 gold each</div>
          </div> */}
        </div>
      </div>
    );
  }

  const sellPrice = resourceDef.sellPrice;

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
        {sellPrice !== undefined ? (
          <>
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
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xl">⚙️</div>
                <h4 className="text-lg font-semibold text-gray-800">Auto-Sell Settings</h4>
                {resource.autoSellEnabled && (
                  <div className="ml-auto flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    ACTIVE
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="autoSellEnabled"
                      checked={resource.autoSellEnabled}
                      onChange={(e) => setAutoSellEnabled(resourceKey, e.target.checked)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="autoSellEnabled" className="text-sm font-medium text-gray-700">
                      Enable Auto-Sell
                    </label>
                  </div>
                  <div className="text-xs text-gray-500">
                    {resource.autoSellEnabled ? 'ON' : 'OFF'}
                  </div>
                </div>

                {/* Threshold Input Section */}
                {resource.autoSellEnabled && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">
                      Keep this many items (auto-sell excess):
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={autoSellThreshold}
                        onChange={(e) => setAutoSellThresholdInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const parsedValue = formattingUtil.parseFormattedNumber(autoSellThreshold);
                            if (parsedValue !== null && parsedValue >= 0) {
                              setAutoSellThreshold(resourceKey, Math.floor(parsedValue));
                              setAutoSellThresholdInput(formattingUtil.formatNumber(Math.floor(parsedValue)));
                            } else {
                              setAutoSellThresholdInput(formattingUtil.formatNumber(resource.autoSellThreshold));
                            }
                          }
                        }}
                        placeholder="e.g., 1.5K, 2M, 100"
                        className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const parsedValue = formattingUtil.parseFormattedNumber(autoSellThreshold);
                          if (parsedValue !== null && parsedValue >= 0) {
                            setAutoSellThreshold(resourceKey, Math.floor(parsedValue));
                            setAutoSellThresholdInput(formattingUtil.formatNumber(Math.floor(parsedValue)));
                          } else {
                            setAutoSellThresholdInput(formattingUtil.formatNumber(resource.autoSellThreshold));
                          }
                        }}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}

                {/* Auto-Sell Status Display */}
                {resource.autoSellEnabled && resource.autoSellThreshold > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-green-600 text-lg">✅</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-green-800 mb-1">
                          Auto-Sell Active
                        </div>
                        <div className="text-sm text-green-700 mb-2">
                          Will automatically sell excess items when you have more than <strong>{resource.autoSellThreshold.toLocaleString()}</strong> items
                        </div>
                        <div className="text-xs text-green-600">
                          Current: {resource.amount.toLocaleString()} items • 
                          Threshold: {resource.autoSellThreshold.toLocaleString()} items • 
                          Excess: {Math.max(0, resource.amount - resource.autoSellThreshold).toLocaleString()} items
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Text */}
                {!resource.autoSellEnabled && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-800">
                      <strong>💡 Tip:</strong> Auto-sell helps manage inventory by automatically selling excess items when you exceed your threshold.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <strong>Non-sellable Resource</strong>
            </div>
            <div className="text-sm text-blue-700 mt-1">
              This resource cannot be sold.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
