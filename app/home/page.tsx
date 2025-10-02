'use client';

import WoodControl from '../../components/WoodControl';
import BerryControl from '../../components/BerryControl';
import useGameStore from '../../stores/gameStore';

export default function Home() {
  const { addResourceAmount } = useGameStore();

  const addDebugWood = () => {
    addResourceAmount('wood', 10);
  };

  const addDebugBerries = () => {
    addResourceAmount('berries', 10);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Home</h1>
          <div className="flex gap-2">
            <button
              onClick={addDebugWood}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              +10 Wood (Debug)
            </button>
            <button
              onClick={addDebugBerries}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              +10 Berries (Debug)
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WoodControl />
          <BerryControl />
        </div>
      </div>
    </div>
  );
}
