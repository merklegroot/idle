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
    { name: 'Chicken', path: '/assets/cute-fantasy-rpg/Animals/Chicken/Chicken.png' },
    { name: 'Cow', path: '/assets/cute-fantasy-rpg/Animals/Cow/Cow.png' },
    { name: 'Pig', path: '/assets/cute-fantasy-rpg/Animals/Pig/Pig.png' },
    { name: 'Sheep', path: '/assets/cute-fantasy-rpg/Animals/Sheep/Sheep.png' }
  ],
  'Enemies': [
    { name: 'Skeleton', path: '/assets/cute-fantasy-rpg/Enemies/Skeleton.png' },
    { name: 'Slime Green', path: '/assets/cute-fantasy-rpg/Enemies/Slime_Green.png' }
  ],
  'Decorations': [
    { name: 'Bridge Wood', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Bridge_Wood.png' },
    { name: 'Chest', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Chest.png' },
    { name: 'Fences', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Fences.png' },
    { name: 'House', path: '/assets/cute-fantasy-rpg/Outdoor decoration/House.png' },
    { name: 'Oak Tree Small', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Oak_Tree_Small.png' },
    { name: 'Oak Tree', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Oak_Tree.png' },
    { name: 'Outdoor Decor Free', path: '/assets/cute-fantasy-rpg/Outdoor decoration/Outdoor_Decor_Free.png' }
  ],
  'Player': [
    { name: 'Player Actions', path: '/assets/cute-fantasy-rpg/Player/Player_Actions.png' },
    { name: 'Player', path: '/assets/cute-fantasy-rpg/Player/Player.png' }
  ],
  'Tiles': [
    { name: 'Beach Tile', path: '/assets/cute-fantasy-rpg/Tiles/Beach_Tile.png' },
    { name: 'Cliff Tile', path: '/assets/cute-fantasy-rpg/Tiles/Cliff_Tile.png' },
    { name: 'FarmLand Tile', path: '/assets/cute-fantasy-rpg/Tiles/FarmLand_Tile.png' },
    { name: 'Grass Middle', path: '/assets/cute-fantasy-rpg/Tiles/Grass_Middle.png' },
    { name: 'Path Middle', path: '/assets/cute-fantasy-rpg/Tiles/Path_Middle.png' },
    { name: 'Path Tile', path: '/assets/cute-fantasy-rpg/Tiles/Path_Tile.png' },
    { name: 'Water Middle', path: '/assets/cute-fantasy-rpg/Tiles/Water_Middle.png' },
    { name: 'Water Tile', path: '/assets/cute-fantasy-rpg/Tiles/Water_Tile.png' }
  ]
};

// Emoji assets data
const emojiAssets = {
  'Town Buildings': [
    { name: 'Town Hall', icon: '🏛️' },
    { name: 'Market', icon: '🏪' },
    { name: 'Bank', icon: '🏦' },
    { name: 'Church', icon: '⛪' },
    { name: 'School', icon: '🏫' },
    { name: 'Hospital', icon: '🏥' },
    { name: 'Library', icon: '📚' },
    { name: 'Barracks', icon: '🏰' },
    { name: 'Tavern', icon: '🍺' },
    { name: 'Workshop', icon: '🔨' },
    { name: 'Mill', icon: '🏭' },
    { name: 'Tower', icon: '🗼' },
    { name: 'Castle', icon: '🏰' }
  ],
  'Land & Terrain': [
    { name: 'Plains', icon: '🌾' },
    { name: 'Forest', icon: '🌲' },
    { name: 'Mountain', icon: '⛰️' },
    { name: 'Hill', icon: '🏔️' },
    { name: 'Desert', icon: '🏜️' },
    { name: 'Swamp', icon: '🌿' },
    { name: 'Lake', icon: '🏞️' },
    { name: 'River', icon: '🌊' },
    { name: 'Coast', icon: '🏖️' },
    { name: 'Cave', icon: '🕳️' }
  ],
  'Paths & Roads': [
    { name: 'Road', icon: '🛣️' },
    { name: 'Path', icon: '🛤️' },
    { name: 'Bridge', icon: '🌉' },
    { name: 'Gate', icon: '🚪' },
    { name: 'Wall', icon: '🧱' }
  ],
  'Camps & Settlements': [
    { name: 'Camp', icon: '⛺' },
    { name: 'Tent', icon: '🏕️' },
    { name: 'Outpost', icon: '🏘️' },
    { name: 'Village', icon: '🏘️' },
    { name: 'Fort', icon: '🏯' },
    { name: 'Watchtower', icon: '🗼' }
  ],
  'Food & Agriculture': [
    { name: 'Farm', icon: '🚜' },
    { name: 'Field', icon: '🌾' },
    { name: 'Orchard', icon: '🍎' },
    { name: 'Garden', icon: '🌻' },
    { name: 'Barn', icon: '🏚️' },
    { name: 'Silo', icon: '🏗️' },
    { name: 'Well', icon: '🏺' },
    { name: 'Windmill', icon: '🌾' },
    { name: 'Apiary', icon: '🍯' },
    { name: 'Fish Pond', icon: '🐟' }
  ],
  'Resources': [
    { name: 'Wood', icon: '🪵' },
    { name: 'Berries', icon: '🫐' },
    { name: 'Stone', icon: '🪨' },
    { name: 'Hatchet', icon: '🪓' },
    { name: 'Pickaxe', icon: '⛏️' },
    { name: 'Gold', icon: '🪙' },
    { name: 'House', icon: '🏠' }
  ]
};

export default function AssetPackDetails() {
  const params = useParams();
  const [assetPack, setAssetPack] = useState<AssetPack | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Animals');

  useEffect(() => {
    const pack = assetPacks.find(p => p.id === params.id);
    setAssetPack(pack || null);
    if (pack) {
      // Set the first category as default
      setSelectedCategory(pack.categories[0]);
    }
  }, [params.id]);

  if (!assetPack) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Asset Pack Not Found</h1>
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

  // Determine which assets to show based on pack type
  const isEmojiPack = assetPack.id === 'emoji-assets';
  const currentAssets = isEmojiPack 
    ? emojiAssets[selectedCategory as keyof typeof emojiAssets] || []
    : cuteFantasyAssets[selectedCategory as keyof typeof cuteFantasyAssets] || [];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/asset-packs"
              className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
            >
              ← Back to Asset Packs
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">{assetPack.name}</h1>
            <p className="text-gray-300">{assetPack.description}</p>
          </div>
          <a
            href="/sprite-editor"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Open Sprite Editor
          </a>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {assetPack.categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{selectedCategory}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {currentAssets.map((asset, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors group"
              >
                <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {isEmojiPack ? (
                    <div className="text-6xl group-hover:scale-110 transition-transform">
                      {(asset as any).icon}
                    </div>
                  ) : (
                    <img
                      src={(asset as any).path}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <div className="text-sm text-gray-300 text-center">{asset.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Pack Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Asset Pack Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {assetPack.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-purple-600/20 text-purple-300 text-sm rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Total Assets</h4>
              <p className="text-white">{assetPack.totalAssets}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
