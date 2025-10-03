'use client';

import useGameStore from '../stores/gameStore';
import { 
  CharacterEquipment, 
  WoodDef,
  BerryDef,
  StoneDef,
  HatchetDef,
  PickaxeDef,
  toolEffectiveness
} from '../app/models/ResourceDef';

export default function Equipment() {
  const { 
    getResource, 
    characterEquipment, 
    equipTool, 
    unequipTool, 
    getEquippedTool
  } = useGameStore();

  // Available tools that can be equipped
  const availableTools = [
    { key: 'hatchet', name: HatchetDef.name, icon: HatchetDef.icon },
    { key: 'pickaxe', name: PickaxeDef.name, icon: PickaxeDef.icon }
  ];

  // Resource icon mapping for tool effectiveness display
  const resourceIcons: Record<string, string> = {
    wood: WoodDef.icon,
    berries: BerryDef.icon,
    stone: StoneDef.icon
  };

  const equippedTool = getEquippedTool();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Character Equipment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Character Equipment</h2>
        
        {/* Tool Slot */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-semibold text-gray-600 mb-2">Tool</div>
          <div className="min-h-[80px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
            {equippedTool ? (
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {availableTools.find(tool => tool.key === equippedTool)?.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {availableTools.find(tool => tool.key === equippedTool)?.name}
                  </div>
                  <button
                    onClick={() => unequipTool()}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Unequip
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No tool equipped</div>
            )}
          </div>
        </div>
      </div>

      {/* Available Tools */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Tools</h2>
        
        <div className="space-y-4">
          {availableTools.map(tool => {
            const ownedAmount = getResource(tool.key)?.amount || 0;
            const isEquipped = equippedTool === tool.key;
            
            return (
              <div 
                key={tool.key}
                className={`border rounded-lg p-4 ${
                  isEquipped ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{tool.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                    <div className="text-sm text-gray-600">Owned: {ownedAmount}</div>
                    {/* Show tool effectiveness */}
                    <div className="text-xs text-blue-600 mt-1">
                      Helps with: {toolEffectiveness[tool.key]?.map(resource => 
                        `${resourceIcons[resource]} ${resource}`
                      ).join(', ') || 'None'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {ownedAmount > 0 && !isEquipped && (
                    <button
                      onClick={() => equipTool(tool.key)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors"
                    >
                      Equip
                    </button>
                  )}
                  
                  {isEquipped && (
                    <button
                      onClick={() => unequipTool()}
                      className="flex-1 py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-semibold transition-colors"
                    >
                      Unequip
                    </button>
                  )}
                  
                  {ownedAmount === 0 && (
                    <div className="flex-1 py-2 px-3 bg-gray-300 text-gray-500 rounded text-sm font-semibold text-center">
                      Not owned
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
