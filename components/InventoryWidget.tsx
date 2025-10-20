'use client'

import { useState } from 'react'
import useGameStore from '@/stores/gameStore'
import { WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef, GoldDef, ResourceDef } from '@/app/models/ResourceDef'
import { formattingUtil } from '@/utils/formattingUtil'

interface InventoryWidgetProps {
  maxItems?: number
  showValue?: boolean
  compact?: boolean
  onItemClick?: (resourceKey: string) => void
  onCraftTwine?: () => void
  canCraftTwine?: boolean
}

export default function InventoryWidget({ 
  maxItems = 6, 
  showValue = false, 
  compact = false,
  onItemClick,
  onCraftTwine,
  canCraftTwine
}: InventoryWidgetProps) {
  const { getResource } = useGameStore()

  interface ResourceInventoryItemDef {
    key: string
    name: string
    icon: string
    value?: number
  }

  function toResourceInventoryItemDef(resourceDef: ResourceDef): ResourceInventoryItemDef {
    return {
      key: resourceDef.resourceKey,
      name: resourceDef.name,
      icon: resourceDef.icon,
      value: getValueFromKey(resourceDef.resourceKey)
    }
  }

  function getValueFromKey(key: string): number {
    const values: { [key: string]: number } = {
      'gold': 1,
      'wood': 0.1,
      'stone': 0.2,
      'stick': 0.05,
      'thatch': 0.03,
      'berry': 0.5,
      'hatchet': 10,
      'pickaxe': 15,
      'twine': 0.1,
      'rope': 0.5,
      'cloth': 2,
      'leather': 5
    }
    return values[key] || 0
  }
  
  const allResources = [
    toResourceInventoryItemDef(WoodDef),
    toResourceInventoryItemDef(BerryDef),
    toResourceInventoryItemDef(StoneDef),
    toResourceInventoryItemDef(HatchetDef),
    toResourceInventoryItemDef(PickaxeDef),
    toResourceInventoryItemDef(GoldDef)
  ]

  // Add additional resources that might exist in the game
  const additionalResources = [
    { key: 'stick', name: 'Stick', icon: '╱', value: 0.05 },
    { key: 'thatch', name: 'Thatch', icon: '🌾', value: 0.03 },
    { key: 'twine', name: 'Twine', icon: '🧵', value: 0.1 },
    { key: 'rope', name: 'Rope', icon: '🪢', value: 0.5 },
    { key: 'cloth', name: 'Cloth', icon: '🧶', value: 2 },
    { key: 'leather', name: 'Leather', icon: '🦬', value: 5 }
  ]

  const allItems = [...allResources, ...additionalResources]

  const inventoryItems = allItems.map(resource => {
    const resourceData = getResource(resource.key)
    return {
      ...resource,
      amount: resourceData?.amount || 0,
      totalValue: (resourceData?.amount || 0) * (resource.value || 0)
    }
  }).filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  if (inventoryItems.length === 0) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-gray-50 rounded-lg border border-gray-200`}>
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-sm">No items in inventory</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${compact ? 'p-3' : 'p-4'} bg-white rounded-lg border border-gray-200 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-gray-800`}>
          Inventory
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">
            {inventoryItems.length} item{inventoryItems.length !== 1 ? 's' : ''}
          </div>
          {onCraftTwine && (
            <button
              onClick={onCraftTwine}
              disabled={!canCraftTwine}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                canCraftTwine
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Craft Twine
            </button>
          )}
        </div>
      </div>
      
      <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-1'} max-h-96 overflow-y-auto`}>
        {inventoryItems.map(item => (
          <div
            key={item.key}
            onClick={() => onItemClick?.(item.key)}
            className={`${onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''} p-2 rounded border border-gray-100 transition-colors`}
          >
            <div className="flex items-center gap-2">
              <div className="text-lg">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-800 truncate`}>
                  {item.name}
                </div>
                <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {formattingUtil.formatNumber(item.amount)}
                </div>
              </div>
              {showValue && item.value && item.value > 0 && (
                <div className="text-xs text-yellow-600 font-medium">
                  {formattingUtil.formatNumber(item.totalValue)}💰
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
