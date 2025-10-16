'use client'

import useGameStore from '@/stores/gameStore'

interface PlayerStatsPanelProps {
  onClose?: () => void
}

export default function PlayerStatsPanel({ onClose }: PlayerStatsPanelProps) {
  const { getPlayerStats } = useGameStore()
  const stats = getPlayerStats()

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    if (value >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getStatBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-yellow-500'
    if (value >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 h-fit">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
          <span className="text-lg">👤</span>
          Stats
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            aria-label="Close player stats"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Health */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <span className="text-sm">❤️</span>
              Health
            </span>
            <span className={`text-xs font-semibold ${getStatColor(stats.health)}`}>
              {Math.round(stats.health)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getStatBarColor(stats.health)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.health))}%` }}
            ></div>
          </div>
        </div>

        {/* Warmth */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <span className="text-sm">🔥</span>
              Warmth
            </span>
            <span className={`text-xs font-semibold ${getStatColor(stats.warmth)}`}>
              {Math.round(stats.warmth)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getStatBarColor(stats.warmth)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.warmth))}%` }}
            ></div>
          </div>
        </div>

        {/* Food */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <span className="text-sm">🍎</span>
              Food
            </span>
            <span className={`text-xs font-semibold ${getStatColor(stats.food)}`}>
              {Math.round(stats.food)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getStatBarColor(stats.food)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.food))}%` }}
            ></div>
          </div>
        </div>

        {/* Hydration */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <span className="text-sm">💧</span>
              Hydration
            </span>
            <span className={`text-xs font-semibold ${getStatColor(stats.hydration)}`}>
              {Math.round(stats.hydration)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getStatBarColor(stats.hydration)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.hydration))}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
