'use client'

import { formattingUtil } from '@/utils/formattingUtil'
import useGameStore from '@/stores/gameStore'

interface InventoryItemProps {
  item: {
    key: string
    name: string
    icon: string
    quantity: number
    value?: number
  }
}

export default function InventoryItem({ item }: InventoryItemProps) {
  const { addResourceQuantity } = useGameStore();

  function handleIncrement() {
    addResourceQuantity(item.key, 1);
  }

  return (
    <div
      key={item.key}
      className={`p-2 rounded border border-gray-100`}
    >
      <div className="flex items-center gap-1">
        <div className="text-lg">{item.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-medium text-gray-800 truncate`}>
            {item.name}
          </div>
          <div className={`text-xs text-gray-500`}>
            {formattingUtil.formatNumber(item.quantity)}
          </div>
        </div>
      </div>
      <button
        onClick={handleIncrement}
        className="mt-1 text-xs px-1 py-0.5 rounded border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors w-full"
        title="Debug: Add 1 to inventory"
      >
        +1 (Debug)
      </button>
    </div>
  )
}
