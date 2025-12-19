'use client'

import { formattingUtil } from '@/utils/formattingUtil'

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
    </div>
  )
}
