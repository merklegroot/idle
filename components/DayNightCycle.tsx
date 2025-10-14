'use client'

import { useState, useEffect } from 'react'

interface DayNightCycleProps {
  onClose?: () => void
}

export default function DayNightCycle({ onClose }: DayNightCycleProps) {
  const [timeOfDay, setTimeOfDay] = useState(0) // 0-24 hours
  const [day, setDay] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(prev => {
        const newTime = prev + 0.1 // Advance time by 0.1 hours every interval
        if (newTime >= 24) {
          setDay(prevDay => prevDay + 1)
          return 0 // Reset to midnight
        }
        return newTime
      })
    }, 100) // Update every 100ms for smooth progression

    return () => clearInterval(interval)
  }, [])

  const getTimeString = (hours: number) => {
    const hour = Math.floor(hours)
    const minute = Math.floor((hours - hour) * 60)
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const getPeriod = (hours: number) => {
    if (hours >= 6 && hours < 12) return { name: 'Morning', icon: '🌅', color: 'text-orange-500' }
    if (hours >= 12 && hours < 18) return { name: 'Afternoon', icon: '☀️', color: 'text-yellow-500' }
    if (hours >= 18 && hours < 22) return { name: 'Evening', icon: '🌆', color: 'text-orange-600' }
    return { name: 'Night', icon: '🌙', color: 'text-blue-400' }
  }

  const getBackgroundColor = (hours: number) => {
    if (hours >= 6 && hours < 18) return 'bg-yellow-50 border-yellow-200' // Day
    return 'bg-blue-50 border-blue-200' // Night
  }

  const getTextColor = (hours: number) => {
    if (hours >= 6 && hours < 18) return 'text-yellow-800' // Day
    return 'text-blue-800' // Night
  }

  const period = getPeriod(timeOfDay)

  return (
    <div className={`rounded-lg border p-4 h-fit transition-colors duration-500 ${getBackgroundColor(timeOfDay)}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold flex items-center gap-2 ${getTextColor(timeOfDay)}`}>
          <span className="text-2xl">{period.icon}</span>
          Day/Night Cycle
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            aria-label="Close day/night cycle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${getTextColor(timeOfDay)}`}>
            Day {day}
          </span>
          <span className={`text-lg font-bold ${period.color}`}>
            {getTimeString(timeOfDay)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${getTextColor(timeOfDay)}`}>
            Period
          </span>
          <span className={`text-sm font-semibold ${period.color} flex items-center gap-1`}>
            {period.icon} {period.name}
          </span>
        </div>

        {/* Time Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className={`text-xs font-medium ${getTextColor(timeOfDay)}`}>
              Daily Progress
            </span>
            <span className={`text-xs font-semibold ${period.color}`}>
              {Math.round((timeOfDay / 24) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${period.color.replace('text-', 'bg-')}`}
              style={{ width: `${(timeOfDay / 24) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Visual Sun/Moon Position */}
        <div className="relative w-full h-8 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-full overflow-hidden">
          <div 
            className="absolute top-1 w-6 h-6 rounded-full transition-all duration-300"
            style={{
              left: `${(timeOfDay / 24) * 100}%`,
              transform: 'translateX(-50%)',
              background: timeOfDay >= 6 && timeOfDay < 18 
                ? 'radial-gradient(circle, #ffeb3b 30%, #ff9800 70%)' 
                : 'radial-gradient(circle, #e3f2fd 30%, #90caf9 70%)'
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
