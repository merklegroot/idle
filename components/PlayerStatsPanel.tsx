'use client'

interface PlayerStatsPanelProps {
  onClose?: () => void
}

export default function PlayerStatsPanel({ onClose }: PlayerStatsPanelProps) {
  // Mock data for now - these will be connected to the game store later
  const stats = {
    health: 85,
    warmth: 70,
    food: 60,
    thirst: 45
  }

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
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Player Stats
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            aria-label="Close player stats"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Health */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-lg">❤️</span>
              Health
            </span>
            <span className={`text-sm font-semibold ${getStatColor(stats.health)}`}>
              {stats.health}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStatBarColor(stats.health)}`}
              style={{ width: `${stats.health}%` }}
            ></div>
          </div>
        </div>

        {/* Warmth */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-lg">🔥</span>
              Warmth
            </span>
            <span className={`text-sm font-semibold ${getStatColor(stats.warmth)}`}>
              {stats.warmth}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStatBarColor(stats.warmth)}`}
              style={{ width: `${stats.warmth}%` }}
            ></div>
          </div>
        </div>

        {/* Food */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-lg">🍎</span>
              Food
            </span>
            <span className={`text-sm font-semibold ${getStatColor(stats.food)}`}>
              {stats.food}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStatBarColor(stats.food)}`}
              style={{ width: `${stats.food}%` }}
            ></div>
          </div>
        </div>

        {/* Thirst */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-lg">💧</span>
              Thirst
            </span>
            <span className={`text-sm font-semibold ${getStatColor(stats.thirst)}`}>
              {stats.thirst}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStatBarColor(stats.thirst)}`}
              style={{ width: `${stats.thirst}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
