'use client';

import useGameStore from '@/stores/gameStore';
import { formattingUtil } from '@/utils/formattingUtil';

export default function Town() {
  const { 
    homes, 
    buildHome, 
    upgradeHome, 
    getHomeCost, 
    getHomeUpgradeCost,
    canBuildHome,
    canUpgradeHome,
    getResource 
  } = useGameStore();
  
  const wood = getResource('wood');
  const stone = getResource('stone');
  const gold = getResource('gold');
  
  const woodAmount = wood?.amount || 0;
  const stoneAmount = stone?.amount || 0;
  const goldAmount = gold?.amount || 0;
  
  const homeCost = getHomeCost();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Town</h1>
          <div className="flex gap-6 text-lg">
            <div>
              Wood: <span className="font-semibold text-green-500">{formattingUtil.formatNumber(woodAmount)}</span>
            </div>
            <div>
              Stone: <span className="font-semibold text-gray-400">{formattingUtil.formatNumber(stoneAmount)}</span>
            </div>
            <div>
              Gold: <span className="font-semibold text-yellow-500">{formattingUtil.formatNumber(goldAmount)}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Build New Home</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white mb-2">
                  <p className="mb-1 font-semibold">Cost:</p>
                  <div className="flex gap-4 text-sm">
                    <span className={`${woodAmount >= homeCost.wood ? 'text-green-400' : 'text-red-400'}`}>
                      {formattingUtil.formatNumber(homeCost.wood)} wood
                    </span>
                    <span className={`${stoneAmount >= homeCost.stone ? 'text-green-400' : 'text-red-400'}`}>
                      {formattingUtil.formatNumber(homeCost.stone)} stone
                    </span>
                    <span className={`${goldAmount >= homeCost.gold ? 'text-green-400' : 'text-red-400'}`}>
                      {formattingUtil.formatNumber(homeCost.gold)} gold
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Each new home costs more than the last
                </p>
              </div>
              <button
                onClick={buildHome}
                disabled={!canBuildHome()}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  canBuildHome()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-200 cursor-not-allowed'
                }`}
              >
                Build Home
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Your Homes ({homes.length})</h2>
          {homes.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-white text-lg">No homes built yet</p>
              <p className="text-gray-300 mt-2">Build your first home to start your town!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homes.map((home) => (
                <HomeCard 
                  key={home.id} 
                  home={home} 
                  onUpgrade={() => upgradeHome(home.id)}
                  upgradeCost={getHomeUpgradeCost(home.id)}
                  canUpgrade={canUpgradeHome(home.id)}
                  woodAmount={woodAmount}
                  stoneAmount={stoneAmount}
                  goldAmount={goldAmount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HomeCardProps {
  home: {
    id: string;
    level: number;
    population: number;
    happiness: number;
  };
  onUpgrade: () => void;
  upgradeCost: {
    wood: number;
    stone: number;
    gold: number;
  };
  canUpgrade: boolean;
  woodAmount: number;
  stoneAmount: number;
  goldAmount: number;
}

function HomeCard({ home, onUpgrade, upgradeCost, canUpgrade, woodAmount, stoneAmount, goldAmount }: HomeCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">Home #{home.id.split('-')[1]}</h3>
        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
          Level {home.level}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-300">Population:</span>
          <span className="font-semibold text-white">{home.population}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Happiness:</span>
          <span className="font-semibold text-white">{home.happiness}%</span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-300 mb-2 font-medium">Upgrade Cost:</p>
        <div className="flex gap-2 text-xs">
          <span className={`${woodAmount >= upgradeCost.wood ? 'text-green-400' : 'text-red-400'}`}>
            {formattingUtil.formatNumber(upgradeCost.wood)} wood
          </span>
          <span className={`${stoneAmount >= upgradeCost.stone ? 'text-green-400' : 'text-red-400'}`}>
            {formattingUtil.formatNumber(upgradeCost.stone)} stone
          </span>
          <span className={`${goldAmount >= upgradeCost.gold ? 'text-green-400' : 'text-red-400'}`}>
            {formattingUtil.formatNumber(upgradeCost.gold)} gold
          </span>
        </div>
      </div>
      
      <button
        onClick={onUpgrade}
        disabled={!canUpgrade}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
          canUpgrade
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-600 text-gray-200 cursor-not-allowed'
        }`}
      >
        Upgrade
      </button>
    </div>
  );
}
