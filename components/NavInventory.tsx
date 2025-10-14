'use client'

import useGameStore from '@/stores/gameStore'
import { formattingUtil } from '@/utils/formattingUtil'

export default function NavInventory() {
  const { bootstrap, getResource, homes } = useGameStore();

  const handleBootstrap = () => {
    bootstrap();
  };

  const gold = getResource('gold');
  const wood = getResource('wood');
  const stone = getResource('stone');
  const stick = getResource('stick');
  const thatch = getResource('thatch');
  
  const goldAmount = gold?.amount || 0;
  const woodAmount = wood?.amount || 0;
  const stoneAmount = stone?.amount || 0;
  const stickAmount = stick?.amount || 0;
  const thatchAmount = thatch?.amount || 0;
  
  // Calculate total population from all homes
  const totalPopulation = homes.reduce((sum, home) => sum + home.population, 0);

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">💰</span>
          <span className="font-semibold text-yellow-400">{formattingUtil.formatNumber(goldAmount)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-400">🪵</span>
          <span className="font-semibold text-green-400">{formattingUtil.formatNumber(woodAmount)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-300">🪨</span>
          <span className="font-semibold text-gray-300">{formattingUtil.formatNumber(stoneAmount)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-blue-400">👥</span>
          <span className="font-semibold text-blue-400">{formattingUtil.formatNumber(totalPopulation)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-400">╱</span>
          <span className="font-semibold text-green-400">{formattingUtil.formatNumber(stickAmount)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">🌾</span>
          <span className="font-semibold text-yellow-400">{formattingUtil.formatNumber(thatchAmount)}</span>
        </div>
      </div>
      <button
        onClick={handleBootstrap}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
      >
        Bootstrap
      </button>
    </div>
  )
}
