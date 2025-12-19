'use client'

import useGameStore from '@/stores/gameStore'
import { formattingUtil } from '@/utils/formattingUtil'

export default function NavInventory() {
  const { bootstrap, reset, getResource } = useGameStore();

  const handleBootstrap = () => {
    bootstrap();
  };

  const handleReset = () => {
    const confirmed = window.confirm('Are you sure you want to reset the game? This will clear all progress and cannot be undone.');
    if (confirmed) {
      reset();
    }
  };

  const gold = getResource('gold');
  const wood = getResource('wood');
  const stone = getResource('stone');
  const stick = getResource('stick');
  const thatch = getResource('thatch');
  
  const goldQuantity = gold?.quantity || 0;
  const woodQuantity = wood?.quantity || 0;
  const stoneQuantity = stone?.quantity || 0;
  const stickQuantity = stick?.quantity || 0;
  const thatchQuantity = thatch?.quantity || 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">💰</span>
          <span className="font-semibold text-yellow-400">{formattingUtil.formatNumber(goldQuantity)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-400">🪵</span>
          <span className="font-semibold text-green-400">{formattingUtil.formatNumber(woodQuantity)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-300">🪨</span>
          <span className="font-semibold text-gray-300">{formattingUtil.formatNumber(stoneQuantity)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-400">╱</span>
          <span className="font-semibold text-green-400">{formattingUtil.formatNumber(stickQuantity)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">🌾</span>
          <span className="font-semibold text-yellow-400">{formattingUtil.formatNumber(thatchQuantity)}</span>
        </div>
      </div>
      <button
        onClick={handleBootstrap}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
      >
        Bootstrap
      </button>
      <button
        onClick={handleReset}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
      >
        Reset
      </button>
    </div>
  )
}
