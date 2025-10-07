'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AssetPack {
  id: string;
  name: string;
  description: string;
  image: string;
  categories: string[];
  totalAssets: number;
}

interface Asset {
  name: string;
  id: string;
  category: string;
  type: 'emoji' | 'sprite';
  icon?: string;
  path?: string;
}

const assetPacks: AssetPack[] = [
  {
    id: 'cute-fantasy-rpg',
    name: 'Cute Fantasy RPG',
    description: 'A collection of cute fantasy-themed sprites including animals, enemies, decorations, and tiles',
    image: '/assets/cute-fantasy-rpg/Player/Player.png',
    categories: ['Animals', 'Enemies', 'Decorations', 'Player', 'Tiles'],
    totalAssets: 20
  },
  {
    id: 'emoji-assets',
    name: 'Emoji Assets',
    description: 'A comprehensive collection of emoji-based assets for buildings, terrain, resources, and more',
    image: '🏛️',
    categories: ['Town Buildings', 'Land & Terrain', 'Paths & Roads', 'Camps & Settlements', 'Food & Agriculture', 'Resources'],
    totalAssets: 51
  }
];

// Asset data for the cute-fantasy-rpg pack
const cuteFantasyAssets = {
  'Animals': [
    { name: 'Chicken', path: '/assets/cute-fantasy-rpg/Animals/Chicken/Chicken.png', id: 'chicken' },
    { name: 'Cow', path: '/assets/cute-fantasy-rpg/Animals/Cow/Cow.png', id: 'cow' },
    { name: 'Pig', path: '/assets/cute-fantasy-rpg/Animals/Pig/Pig.png', id: 'pig' },
    { name: 'Sheep', path: '/assets/cute-fantasy-rpg/Animals/Sheep/Sheep.png', id: 'sheep' }
  ],
  'Enemies': [
    { name: 'Skeleton', path: '/assets/cute-fantasy-rpg/Enemies/Skeleton.png', id: 'skeleton' },
    { name: 'Slime Green', path: '/assets/cute-fantasy-rpg/Enemies/Slime_Green.png', id: 'slime_green' }
  ],
  'Decorations': [
    { name: 'Bridge Wood', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Bridge_Wood.png', id: 'bridge_wood' },
    { name: 'Chest', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Chest.png', id: 'chest' },
    { name: 'Fences', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Fences.png', id: 'fences' },
    { name: 'House', path: '/assets/cute-fantasy-rpg/Outdoor decoration/House.png', id: 'house' },
    { name: 'Oak Tree Small', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Oak_Tree_Small.png', id: 'oak_tree_small' },
    { name: 'Oak Tree', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Oak_Tree.png', id: 'oak_tree' },
    { name: 'Outdoor Decor Free', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Outdoor_Decor_Free.png', id: 'outdoor_decor_free' }
  ],
  'Player': [
    { name: 'Player Actions', path: '/assets/cute-fantasy-rpg/Player/Player_Actions.png', id: 'player_actions' },
    { name: 'Player', path: '/assets/cute-fantasy-rpg/Player/Player.png', id: 'player' }
  ],
  'Tiles': [
    { name: 'Beach Tile', path: '/assets/cute-fantasy-rpg/Tiles/Beach_Tile.png', id: 'beach_tile' },
    { name: 'Cliff Tile', path: '/assets/cute-fantasy-rpg/Tiles/Cliff_Tile.png', id: 'cliff_tile' },
    { name: 'FarmLand Tile', path: '/assets/cute-fantasy-rpg/Tiles/FarmLand_Tile.png', id: 'farmland_tile' },
    { name: 'Grass Middle', path: '/assets/cute-fantasy-rpg/Tiles/Grass_Middle.png', id: 'grass_middle' },
    { name: 'Path Middle', path: '/assets/cute-fantasy-rpg/Tiles/Path_Middle.png', id: 'path_middle' },
    { name: 'Path Tile', path: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png', id: 'path_tile' },
    { name: 'Water Middle', path: '/assets/cute-fantasy-rpg/Tiles/Water_Middle.png', id: 'water_middle' },
    { name: 'Water Tile', path: '/assets/cute-fantasy-rpg/Tiles/Water_Tile.png', id: 'water_tile' }
  ]
};

// Emoji assets data
const emojiAssets = {
  'Town Buildings': [
    { name: 'Town Hall', icon: '🏛️', id: 'town_hall' },
    { name: 'Market', icon: '🏪', id: 'market' },
    { name: 'Bank', icon: '🏦', id: 'bank' },
    { name: 'Church', icon: '⛪', id: 'church' },
    { name: 'School', icon: '🏫', id: 'school' },
    { name: 'Hospital', icon: '🏥', id: 'hospital' },
    { name: 'Library', icon: '📚', id: 'library' },
    { name: 'Barracks', icon: '🏰', id: 'barracks' },
    { name: 'Tavern', icon: '🍺', id: 'tavern' },
    { name: 'Workshop', icon: '🔨', id: 'workshop' },
    { name: 'Mill', icon: '🏭', id: 'mill' },
    { name: 'Tower', icon: '🗼', id: 'tower' },
    { name: 'Castle', icon: '🏰', id: 'castle' }
  ],
  'Land & Terrain': [
    { name: 'Plains', icon: '🌾', id: 'plains' },
    { name: 'Forest', icon: '🌲', id: 'forest' },
    { name: 'Mountain', icon: '⛰️', id: 'mountain' },
    { name: 'Hill', icon: '🏔️', id: 'hill' },
    { name: 'Desert', icon: '🏜️', id: 'desert' },
    { name: 'Swamp', icon: '🌿', id: 'swamp' },
    { name: 'Lake', icon: '🏞️', id: 'lake' },
    { name: 'River', icon: '🌊', id: 'river' },
    { name: 'Coast', icon: '🏖️', id: 'coast' },
    { name: 'Cave', icon: '🕳️', id: 'cave' }
  ],
  'Paths & Roads': [
    { name: 'Road', icon: '🛣️', id: 'road' },
    { name: 'Path', icon: '🛤️', id: 'path' },
    { name: 'Bridge', icon: '🌉', id: 'bridge' },
    { name: 'Gate', icon: '🚪', id: 'gate' },
    { name: 'Wall', icon: '🧱', id: 'wall' }
  ],
  'Camps & Settlements': [
    { name: 'Camp', icon: '⛺', id: 'camp' },
    { name: 'Tent', icon: '🏕️', id: 'tent' },
    { name: 'Outpost', icon: '🏘️', id: 'outpost' },
    { name: 'Village', icon: '🏘️', id: 'village' },
    { name: 'Fort', icon: '🏯', id: 'fort' },
    { name: 'Watchtower', icon: '🗼', id: 'watchtower' }
  ],
  'Food & Agriculture': [
    { name: 'Farm', icon: '🚜', id: 'farm' },
    { name: 'Field', icon: '🌾', id: 'field' },
    { name: 'Orchard', icon: '🍎', id: 'orchard' },
    { name: 'Garden', icon: '🌻', id: 'garden' },
    { name: 'Barn', icon: '🏚️', id: 'barn' },
    { name: 'Silo', icon: '🏗️', id: 'silo' },
    { name: 'Well', icon: '🏺', id: 'well' },
    { name: 'Windmill', icon: '🌾', id: 'windmill' },
    { name: 'Apiary', icon: '🍯', id: 'apiary' },
    { name: 'Fish Pond', icon: '🐟', id: 'fish_pond' }
  ],
  'Resources': [
    { name: 'Wood', icon: '🪵', id: 'wood' },
    { name: 'Berries', icon: '🫐', id: 'berries' },
    { name: 'Stone', icon: '🪨', id: 'stone' },
    { name: 'Hatchet', icon: '🪓', id: 'hatchet' },
    { name: 'Pickaxe', icon: '⛏️', id: 'pickaxe' },
    { name: 'Gold', icon: '🪙', id: 'gold' },
    { name: 'House', icon: '🏠', id: 'house' }
  ]
};

export default function AssetDetail() {
  const params = useParams();
  const [assetPack, setAssetPack] = useState<AssetPack | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const packId = params.id as string;
    const assetId = params.assetId as string;
    
    const pack = assetPacks.find(p => p.id === packId);
    setAssetPack(pack || null);
    
    if (pack) {
      const isEmojiPack = pack.id === 'emoji-assets';
      const allAssets = isEmojiPack ? emojiAssets : cuteFantasyAssets;
      
      // Find the asset across all categories
      let foundAsset: Asset | null = null;
      let foundCategory = '';
      
      for (const [category, assets] of Object.entries(allAssets)) {
        const found = assets.find(a => a.id === assetId);
        if (found) {
          foundAsset = {
            ...found,
            category,
            type: isEmojiPack ? 'emoji' : 'sprite'
          } as Asset;
          foundCategory = category;
          break;
        }
      }
      
      setAsset(foundAsset);
    }
  }, [params.id, params.assetId]);

  if (!assetPack || !asset) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Asset Not Found</h1>
            <p className="text-gray-300 mb-6">The requested asset could not be found.</p>
            <Link
              href="/asset-packs"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to Asset Packs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isEmojiAsset = asset.type === 'emoji';

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/asset-packs" className="hover:text-purple-400 transition-colors">
              Asset Packs
            </Link>
            <span>›</span>
            <Link 
              href={`/asset-packs/${assetPack.id}`} 
              className="hover:text-purple-400 transition-colors"
            >
              {assetPack.name}
            </Link>
            <span>›</span>
            <span className="text-white">{asset.name}</span>
          </nav>
        </div>

        {/* Asset Display */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Asset Preview */}
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {isEmojiAsset ? (
                  <div className="text-8xl">
                    {asset.icon}
                  </div>
                ) : (
                  <img
                    src={asset.path}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Asset Information */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">{asset.name}</h1>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Asset ID</h3>
                  <div 
                    className="text-lg text-purple-400 font-mono bg-gray-700 px-3 py-2 rounded cursor-pointer hover:text-purple-300 transition-colors inline-block"
                    onClick={() => navigator.clipboard.writeText(asset.id)}
                    title="Click to copy Asset ID"
                  >
                    {asset.id}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Category</h3>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded">
                    {asset.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Type</h3>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded">
                    {asset.type === 'emoji' ? 'Emoji Asset' : 'Sprite Asset'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Asset Pack</h3>
                  <Link 
                    href={`/asset-packs/${assetPack.id}`}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {assetPack.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <a
            href={`/sprite-editor?packId=${assetPack.id}&assetId=${asset.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Open in Sprite Editor
          </a>
          
          <button
            onClick={() => {
              const assetData = {
                name: asset.name,
                id: asset.id,
                packId: assetPack.id,
                packName: assetPack.name,
                category: asset.category,
                type: asset.type,
                ...(isEmojiAsset ? { icon: asset.icon } : { path: asset.path })
              };
              navigator.clipboard.writeText(JSON.stringify(assetData, null, 2));
            }}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Copy Asset Data
          </button>
        </div>
      </div>
    </div>
  );
}
