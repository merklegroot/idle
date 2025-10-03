'use client';

import { useEffect } from 'react';
import useGameStore from '../stores/gameStore';
import { GatherableResourceDef, WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef } from '../app/models/ResourceDef';
import { formattingUtil } from '@/utils/formattingUtil';

export default function ResourceControl({resourceDef}: {resourceDef: GatherableResourceDef}) {
  const {
    getResource,
    hireWorker,
    startGathering,
    initializeResource,
    startGameLoop,
    getToolBonus
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
  const gold = getResource('gold');
  
  // Use default values if resource doesn't exist yet
  const {
    amount = 0,
    perSecond = 0,
    workers = 0,
    paidWorkers = 0,
    workerCost = resourceDef.workerCost,
    workerSalary = resourceDef.workerSalary,
    isGathering = false,
    gatherProgress = 0,
    workerProgress = 0
  } = resource || {};

  const goldAmount = gold?.amount || 0;
  
  // Get tool bonus for this resource
  const toolBonus = getToolBonus(resourceDef.resourceKey);
  
  // Resource icon mapping
  const resourceIcons: Record<string, string> = {
    wood: WoodDef.icon,
    berries: BerryDef.icon,
    stone: StoneDef.icon,
    hatchet: HatchetDef.icon,
    pickaxe: PickaxeDef.icon
  };
  
  // Check if materials are available for gathering
  const hasMaterials = resourceDef.materials ? 
    resourceDef.materials.every(material => {
      const materialResource = getResource(material.resourceKey);
      return materialResource && materialResource.amount >= material.amount;
    }) : true;

  return (
      <div 
        className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all ${
          isGathering ? 'ring-2 ring-green-400' : ''
        } ${
          hasMaterials ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-75'
        }`}
        onClick={() => {
          if (hasMaterials) {
            startGathering(resourceDef.resourceKey);
          }
          // If no materials, do nothing (could add a toast notification here)
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{resourceDef.icon}</div>
          <h2 className="text-2xl font-bold text-gray-800">{resourceDef.name}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {formattingUtil.formatNumber(amount)}
            </div>
            <div className="text-sm text-gray-500">
              +{perSecond}/sec
              {toolBonus > 0 && (
                <span className="text-green-600 ml-2">
                  (+{toolBonus}% tool bonus)
                </span>
              )}
            </div>
            
            {/* Material Requirements */}
            {resourceDef.materials && resourceDef.materials.length > 0 && (
              <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <div className="text-xs text-yellow-800 font-semibold mb-1">Materials Required:</div>
                <div className="flex flex-wrap gap-1">
                  {resourceDef.materials.map((material, index) => {
                    const materialResource = getResource(material.resourceKey);
                    const materialAmount = materialResource?.amount || 0;
                    const hasEnough = materialAmount >= material.amount;
                    
                    return (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded ${
                          hasEnough 
                            ? 'bg-green-100 text-green-800 border border-green-300' 
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {material.amount} {resourceIcons[material.resourceKey] || material.resourceKey} {hasEnough ? '✓' : '✗'}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="mt-3">
            <div className="text-xs text-gray-600 mb-1">
              {isGathering ? 'Gathering...' : 
               hasMaterials ? `Click to gather ${resourceDef.name.toLowerCase()}` : 
               `Need materials to gather ${resourceDef.name.toLowerCase()}`}
            </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    isGathering ? 'bg-green-600 transition-all duration-75' : 'bg-gray-400'
                  }`}
                  style={{ width: `${isGathering ? gatherProgress : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-1">
                {paidWorkers > 0 ? (
                  `Workers gathering (${paidWorkers}/${workers} paid)`
                ) : workers > 0 ? (
                  `${workers} workers (unpaid)`
                ) : (
                  'No workers gathering'
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative">
                {paidWorkers > 0 ? (
                  paidWorkers >= 3 ? (
                    // Fast gathering: solid bar with text
                    <div className="bg-blue-600 h-2 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">
                        {paidWorkers} / sec
                      </span>
                    </div>
                  ) : (
                    // Slow gathering: animated progress bar
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-75"
                      style={{ width: `${workerProgress}%` }}
                    ></div>
                  )
                ) : (
                  // No paid workers: empty gray bar
                  <div className="bg-gray-300 h-2 rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-gray-600">Workers</div>
              <div className="font-semibold">{workers}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-gray-600">Paid</div>
              <div className="font-semibold">{paidWorkers}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-gray-600">Salary</div>
              <div className="font-semibold">{workerSalary}/sec</div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              hireWorker(resourceDef.resourceKey);
            }}
            disabled={goldAmount < workerCost}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              goldAmount >= workerCost
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Hire Worker ({formattingUtil.formatNumber(workerCost)} 🪙)
          </button>
        </div>
      </div>
  );
}
