'use client';

import { useState } from 'react';
import AssetShowcase from '@/components/AssetShowcase';
import { 
  // Town Buildings
  TownHallDef, MarketDef, BankDef, ChurchDef, SchoolDef, HospitalDef, 
  LibraryDef, BarracksDef, TavernDef, WorkshopDef, MillDef, TowerDef, CastleDef,
  
  // Land and Terrain
  PlainsDef, ForestDef, MountainDef, HillDef, DesertDef, SwampDef, 
  LakeDef, RiverDef, CoastDef, CaveDef,
  
  // Paths and Roads
  RoadDef, PathDef, BridgeDef, GateDef, WallDef,
  
  // Camps and Settlements
  CampDef, TentDef, OutpostDef, VillageDef, FortDef, WatchtowerDef,
  
  // Food and Agriculture
  FarmDef, FieldDef, OrchardDef, GardenDef, BarnDef, SiloDef, 
  WellDef, WindmillDef, ApiaryDef, FishPondDef,
  
  // Existing Resources
  WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef, GoldDef, HouseDef
} from '@/app/models/ResourceDef';

export default function Icons() {
  const [isEmojiSectionOpen, setIsEmojiSectionOpen] = useState(true);

  const townBuildings = [
    TownHallDef, MarketDef, BankDef, ChurchDef, SchoolDef, HospitalDef, 
    LibraryDef, BarracksDef, TavernDef, WorkshopDef, MillDef, TowerDef, CastleDef
  ];

  const landTerrain = [
    PlainsDef, ForestDef, MountainDef, HillDef, DesertDef, SwampDef, 
    LakeDef, RiverDef, CoastDef, CaveDef
  ];

  const pathsRoads = [
    RoadDef, PathDef, BridgeDef, GateDef, WallDef
  ];

  const campsSettlements = [
    CampDef, TentDef, OutpostDef, VillageDef, FortDef, WatchtowerDef
  ];

  const foodAgriculture = [
    FarmDef, FieldDef, OrchardDef, GardenDef, BarnDef, SiloDef, 
    WellDef, WindmillDef, ApiaryDef, FishPondDef
  ];

  const existingResources = [
    WoodDef, BerryDef, StoneDef, HatchetDef, PickaxeDef, GoldDef, HouseDef
  ];

  const IconGrid = ({ title, icons }: { title: string, icons: any[] }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {icons.map((iconDef) => (
          <div key={iconDef.resourceKey} className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-4xl mb-2">{iconDef.icon}</div>
            <div className="text-sm text-gray-300">{iconDef.name}</div>
            <div className="text-xs text-gray-500 mt-1">{iconDef.resourceKey}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Asset Showcase</h1>
        <p className="text-gray-300 mb-8">Browse all available assets for your idle game</p>
        
        {/* Emoji Section - Collapsible */}
        <div className="mb-8">
          <button
            onClick={() => setIsEmojiSectionOpen(!isEmojiSectionOpen)}
            className="flex items-center gap-3 text-2xl font-bold text-white mb-4 hover:text-gray-300 transition-colors"
          >
            <span className="text-3xl">😀</span>
            <span>Emoji Assets</span>
            <span className="text-xl">{isEmojiSectionOpen ? '▼' : '▶'}</span>
          </button>
          
          {isEmojiSectionOpen && (
            <div className="space-y-8">
              <IconGrid title="🏛️ Town Buildings" icons={townBuildings} />
              <IconGrid title="🌍 Land & Terrain" icons={landTerrain} />
              <IconGrid title="🛣️ Paths & Roads" icons={pathsRoads} />
              <IconGrid title="⛺ Camps & Settlements" icons={campsSettlements} />
              <IconGrid title="🌾 Food & Agriculture" icons={foodAgriculture} />
              <IconGrid title="🛠️ Existing Resources" icons={existingResources} />
            </div>
          )}
        </div>

        {/* Pixel Art Assets Section */}
        <AssetShowcase />
      </div>
    </div>
  );
}