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
import { AssetsGrid } from './AssetsGrid';

export default function Assets() {
  const [isEmojiSectionOpen, setIsEmojiSectionOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Asset Showcase</h1>
            <p className="text-gray-300">Browse all available assets for your idle game</p>
          </div>
          <a
            href="/sprite-editor"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Open Sprite Editor
          </a>
        </div>
        
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
              <AssetsGrid title="🏛️ Town Buildings" icons={townBuildings} />
              <AssetsGrid title="🌍 Land & Terrain" icons={landTerrain} />
              <AssetsGrid title="🛣️ Paths & Roads" icons={pathsRoads} />
              <AssetsGrid title="⛺ Camps & Settlements" icons={campsSettlements} />
              <AssetsGrid title="🌾 Food & Agriculture" icons={foodAgriculture} />
              <AssetsGrid title="🛠️ Existing Resources" icons={existingResources} />
            </div>
          )}
        </div>

        {/* Pixel Art Assets Section */}
        <AssetShowcase />
      </div>
    </div>
  );
}