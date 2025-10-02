'use client';

import { useState, useEffect } from 'react';

interface WoodState {
  amount: number;
  perSecond: number;
  workers: number;
  workerCost: number;
  isGathering: boolean;
  gatherProgress: number;
}

export default function WoodControl() {
  const [wood, setWood] = useState<WoodState>({
    amount: 0,
    perSecond: 0,
    workers: 0,
    workerCost: 10,
    isGathering: false,
    gatherProgress: 0
  });

  // Update wood amount every second
  useEffect(() => {
    const interval = setInterval(() => {
      setWood(prev => ({
        ...prev,
        amount: prev.amount + prev.perSecond
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle gathering progress
  useEffect(() => {
    if (!wood.isGathering) return;

    const gatherInterval = setInterval(() => {
      setWood(prev => {
        const newProgress = prev.gatherProgress + 10; // 10% per 100ms
        if (newProgress >= 100) {
          return {
            ...prev,
            amount: prev.amount + 1,
            isGathering: false,
            gatherProgress: 0
          };
        }
        return {
          ...prev,
          gatherProgress: newProgress
        };
      });
    }, 100);

    return () => clearInterval(gatherInterval);
  }, [wood.isGathering]);

  const startGathering = () => {
    if (!wood.isGathering) {
      setWood(prev => ({
        ...prev,
        isGathering: true,
        gatherProgress: 0
      }));
    }
  };

  const hireWorker = () => {
    if (wood.amount >= wood.workerCost) {
      setWood(prev => ({
        ...prev,
        amount: prev.amount - prev.workerCost,
        workers: prev.workers + 1,
        perSecond: prev.perSecond + 1,
        workerCost: Math.floor(prev.workerCost * 1.15)
      }));
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toString();
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer transition-all hover:shadow-lg ${
        wood.isGathering ? 'ring-2 ring-green-400' : ''
      }`}
      onClick={startGathering}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">🪵</div>
        <h2 className="text-2xl font-bold text-gray-800">Wood</h2>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {formatNumber(wood.amount)}
          </div>
          <div className="text-sm text-gray-500">
            +{wood.perSecond}/sec
          </div>
          
          {wood.isGathering && (
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-1">Gathering...</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${wood.gatherProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-gray-600">Workers</div>
            <div className="font-semibold">{wood.workers}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-gray-600">Production</div>
            <div className="font-semibold">{wood.perSecond}/sec</div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            hireWorker();
          }}
          disabled={wood.amount < wood.workerCost}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            wood.amount >= wood.workerCost
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Hire Worker ({formatNumber(wood.workerCost)} wood)
        </button>
      </div>
    </div>
  );
}
