'use client'

import { useState, useEffect } from 'react'

export default function CompactDayNightCycle() {
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
    if (hours >= 6 && hours < 12) return { icon: '🌅', color: 'text-orange-500' }
    if (hours >= 12 && hours < 18) return { icon: '☀️', color: 'text-yellow-500' }
    if (hours >= 18 && hours < 22) return { icon: '🌆', color: 'text-orange-600' }
    return { icon: '🌙', color: 'text-blue-400' }
  }

  const period = getPeriod(timeOfDay)

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-lg">{period.icon}</span>
      <span className="font-semibold text-gray-700">Day {day}</span>
      <span className={`font-mono font-bold ${period.color}`}>
        {getTimeString(timeOfDay)}
      </span>
    </div>
  )
}
