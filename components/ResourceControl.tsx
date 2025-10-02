'use client';

import { useEffect } from 'react';
import useGameStore from '../stores/gameStore';
import { ResourceDef } from '../app/models/ResourceDef';

export default function ResourceControl({resourceDef}: {resourceDef: ResourceDef}) {
  const {
    getResource,
    hireWorker,
    startGathering,
    initializeResource,
    startGameLoop
  } = useGameStore();

  // Initialize resource on mount
  useEffect(() => {
    initializeResource(resourceDef.resourceKey);
  }, [resourceDef.resourceKey, initializeResource]);

  // Start game loop on mount
  useEffect(() => {
    startGameLoop();
  }, [startGameLoop]);

  // Get current resource state
  const resource = getResource(resourceDef.resourceKey);
  
  // Use default values if resource doesn't exist yet
  const {
    amount = 0,
    perSecond = 0,
    workers = 0,
    workerCost = 10,
    isGathering = false,
    gatherProgress = 0,
    workerProgress = 0
  } = resource || {};


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
          isGathering ? 'ring-2 ring-green-400' : ''
        }`}
        onClick={() => startGathering(resourceDef.resourceKey)}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{resourceDef.icon}</div>
          <h2 className="text-2xl font-bold text-gray-800">{resourceDef.name}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {formatNumber(amount)}
            </div>
            <div className="text-sm text-gray-500">
              +{perSecond}/sec
            </div>
            
            <div className="mt-3">
            <div className="text-xs text-gray-600 mb-1">
              {isGathering ? 'Gathering...' : `Click to gather ${resourceDef.name.toLowerCase()}`}
            </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-75 ${
                    isGathering ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                  style={{ width: `${isGathering ? gatherProgress : 0}%` }}
                ></div>
              </div>
            </div>

            {workers > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-1">
                  Workers gathering ({workers} worker{workers > 1 ? 's' : ''})
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-75"
                    style={{ width: `${workerProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-gray-600">Workers</div>
              <div className="font-semibold">{workers}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-gray-600">Production</div>
              <div className="font-semibold">{perSecond}/sec</div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              hireWorker(resourceDef.resourceKey);
            }}
            disabled={amount < workerCost}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              amount >= workerCost
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Hire Worker ({formatNumber(workerCost)} {resourceDef.name})
          </button>
        </div>
      </div>
  );
}
