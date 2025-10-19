'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import useGameStore from '@/stores/gameStore'
import { WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef, GoldDef, ResourceDef } from '@/app/models/ResourceDef'
import InventoryItem from '@/components/InventoryItem'
import ItemDetails from '@/components/ItemDetails'
import CompactStatsBar from '@/components/CompactStatsBar'
import CompactDayNightCycle from '@/components/CompactDayNightCycle'
import { formattingUtil } from '@/utils/formattingUtil'

export default function InventoryPage() {
  const { getResource, sellResource, sellAllResource, getPlayerStats } = useGameStore()
  const searchParams = useSearchParams()
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'resources' | 'tools' | 'consumables'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'value'>('name')

  // Handle URL parameter for pre-selecting items
  useEffect(() => {
    const selectedFromUrl = searchParams.get('selected')
    if (selectedFromUrl) {
      setSelectedItem(selectedFromUrl)
    }
  }, [searchParams])

  interface ResourceInventoryItemDef {
    key: string
    name: string
    icon: string
    category: 'resources' | 'tools' | 'consumables'
    value?: number
  }

  function toResourceInventoryItemDef(resourceDef: ResourceDef): ResourceInventoryItemDef {
    return {
      key: resourceDef.resourceKey,
      name: resourceDef.name,
      icon: resourceDef.icon,
      category: getCategoryFromKey(resourceDef.resourceKey),
      value: getValueFromKey(resourceDef.resourceKey)
    }
  }

  function getCategoryFromKey(key: string): 'resources' | 'tools' | 'consumables' {
    if (['hatchet', 'pickaxe'].includes(key)) return 'tools'
    if (['berry'].includes(key)) return 'consumables'
    return 'resources'
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
      'pickaxe': 15
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
    { key: 'stick', name: 'Stick', icon: '╱', category: 'resources' as const, value: 0.05 },
    { key: 'thatch', name: 'Thatch', icon: '🌾', category: 'resources' as const, value: 0.03 }
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

  // Apply filters
  const filteredItems = inventoryItems.filter(item => {
    if (filter === 'all') return true
    return item.category === filter
  })

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'amount':
        return b.amount - a.amount
      case 'value':
        return b.totalValue - a.totalValue
      default:
        return 0
    }
  })

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0)
  const playerStats = getPlayerStats()

  const handleSellItem = (resourceKey: string, amount: number) => {
    sellResource(resourceKey, amount)
  }

  const handleSellAll = (resourceKey: string) => {
    sellAllResource(resourceKey)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
              <CompactDayNightCycle />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Value</div>
                <div className="text-xl font-bold text-yellow-600">
                  {formattingUtil.formatNumber(totalValue)} 💰
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <CompactStatsBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Inventory */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Controls */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  {/* Filter */}
                  <div className="flex gap-2">
                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Items</option>
                      <option value="resources">Resources</option>
                      <option value="tools">Tools</option>
                      <option value="consumables">Consumables</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex gap-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="name">Name</option>
                      <option value="amount">Amount</option>
                      <option value="value">Value</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="p-6">
              {sortedItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <div className="text-xl text-gray-500 mb-2">No items in inventory</div>
                  <div className="text-sm text-gray-400">
                    {filter === 'all' 
                      ? 'Start gathering resources to see them here!'
                      : `No ${filter} found in your inventory.`
                    }
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedItems.map(item => (
                    <div
                      key={item.key}
                      onClick={() => setSelectedItem(item.key)}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 truncate">{item.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="font-semibold text-gray-800">
                            {formattingUtil.formatNumber(item.amount)}
                          </span>
                        </div>
                        
                        {item.value && item.value > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Value:</span>
                            <span className="font-semibold text-yellow-600">
                              {formattingUtil.formatNumber(item.totalValue)} 💰
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-3 pt-3 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSellItem(item.key, 1)
                            }}
                            className="flex-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
                          >
                            Sell 1
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSellAll(item.key)
                            }}
                            className="flex-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded transition-colors"
                          >
                            Sell All
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Item Details Sidebar */}
          {selectedItem && (
            <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200">
              <ItemDetails
                resourceKey={selectedItem}
                onClose={() => setSelectedItem(null)}
                onSell={(amount) => handleSellItem(selectedItem, amount)}
                onSellAll={() => handleSellAll(selectedItem)}
              />
            </div>
          )}
        </div>

        {/* Player Stats Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Player Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">❤️</div>
              <div className="text-sm text-gray-500">Health</div>
              <div className="font-semibold text-red-600">{playerStats.health}/100</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-sm text-gray-500">Warmth</div>
              <div className="font-semibold text-orange-600">{playerStats.warmth}/100</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🍎</div>
              <div className="text-sm text-gray-500">Food</div>
              <div className="font-semibold text-green-600">{playerStats.food}/100</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💧</div>
              <div className="text-sm text-gray-500">Hydration</div>
              <div className="font-semibold text-blue-600">{playerStats.hydration}/100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
