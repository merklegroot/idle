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

export default function AssetPackDetails() {
  const params = useParams();
  const [assetPack, setAssetPack] = useState<AssetPack | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Animals');
  const [editingId, setEditingId] = useState<boolean>(false);
  const [newId, setNewId] = useState<string>('');

  useEffect(() => {
    const pack = assetPacks.find(p => p.id === params.id);
    setAssetPack(pack || null);
    if (pack) {
      // Set the first category as default
      setSelectedCategory(pack.categories[0]);
      setNewId(pack.id);
    }
  }, [params.id]);

  const handleEditId = () => {
    setEditingId(true);
  };

  const handleSaveId = () => {
    if (newId.trim() && assetPack) {
      // Update the asset pack ID
      const updatedPack = { ...assetPack, id: newId.trim() };
      setAssetPack(updatedPack);
      setEditingId(false);
      
      // Update the URL to reflect the new ID
      window.history.replaceState(null, '', `/asset-packs/${newId.trim()}`);
    }
  };

  const handleCancelEdit = () => {
    setNewId(assetPack?.id || '');
    setEditingId(false);
  };

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
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors group cursor-pointer"
                onClick={() => {
                  // Navigate directly to sprite editor with clean URL
                  window.open(`/sprite-editor?packId=${assetPack.id}&assetId=${(asset as any).id}`, '_blank');
                }}
                title="Click to open in Sprite Editor"
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
                <div className="text-sm text-gray-300 text-center mb-2">{asset.name}</div>
                <div 
                  className="text-xs text-purple-400 text-center cursor-pointer hover:text-purple-300 transition-colors font-mono bg-gray-700 px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening sprite editor when clicking ID
                    navigator.clipboard.writeText((asset as any).id);
                  }}
                  title="Click to copy ID"
                >
                  {(asset as any).id}
                </div>
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
          
          <div className="mt-6 pt-6 border-t border-gray-600">
            <h4 className="text-lg font-semibold text-gray-300 mb-2">Asset Pack ID</h4>
            
            {editingId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="text-lg text-white font-mono bg-gray-700 px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none flex-1"
                    placeholder="Enter asset pack ID"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveId}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="text-lg text-purple-400 font-mono bg-gray-700 px-3 py-2 rounded cursor-pointer hover:text-purple-300 transition-colors"
                    onClick={() => navigator.clipboard.writeText(assetPack.id)}
                    title="Click to copy Asset Pack ID"
                  >
                    {assetPack.id}
                  </div>
                  <button
                    onClick={handleEditId}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Click ID to copy</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-400">Click Edit to change</span>
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-400 mt-3">
              Use this ID to reference this asset pack in your game code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
