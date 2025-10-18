'use client'

import useGameStore from '@/stores/gameStore'

export default function CompactStatsBar() {
  const { getPlayerStats } = useGameStore()
  const stats = getPlayerStats()

  const getStatBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-yellow-500'
    if (value >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const statsData = [
    { key: 'health', icon: '❤️', value: stats.health, label: 'Health' },
    { key: 'warmth', icon: '🔥', value: stats.warmth, label: 'Warmth' },
    { key: 'food', icon: '🍎', value: stats.food, label: 'Food' },
    { key: 'hydration', icon: '💧', value: stats.hydration, label: 'Hydration' }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center gap-4">
        {statsData.map((stat) => (
          <div key={stat.key} className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg" title={stat.label}>
                {stat.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStatBarColor(stat.value)}`}
                    style={{ width: `${Math.min(100, Math.max(0, stat.value))}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 min-w-0">
                {Math.round(stat.value)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
