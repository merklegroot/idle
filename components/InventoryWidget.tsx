'use client'

import useGameStore from '@/stores/gameStore'
import { WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef, GoldDef, ResourceDef } from '@/app/models/ResourceDef'
import InventoryItem from './InventoryItem'

export default function InventoryWidget() {
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
      icon: resourceDef.icon
    }
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
    { key: 'knapped-axe-head', name: 'Knapped Axe Head', icon: '🪨', value: 0.2 },
    { key: 'rope', name: 'Rope', icon: '🪢', value: 0.5 },
    { key: 'cloth', name: 'Cloth', icon: '🧶', value: 2 },
    { key: 'leather', name: 'Leather', icon: '🦬', value: 5 }
  ]

  const allItems = [...allResources, ...additionalResources]

  const inventoryItems = allItems.map(resource => {
    const resourceData = getResource(resource.key)
    return {
      ...resource,
      amount: resourceData?.amount || 0
    }
  }).filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className={`p-3 bg-white rounded-lg border border-gray-200 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold text-gray-800`}>
          Inventory
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">
            {inventoryItems.length} item{inventoryItems.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className={`grid gap-2 grid-cols-4 max-h-96 overflow-y-auto`}>
        {inventoryItems.map(item => (
          <InventoryItem key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}
