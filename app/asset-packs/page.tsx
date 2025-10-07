'use client';

import Link from 'next/link';

const assetPacks = [
  {
    id: 'cute-fantasy-rpg',
    name: 'Cute Fantasy RPG',
    description: 'A collection of cute fantasy-themed sprites including animals, enemies, decorations, and tiles',
    image: '/assets/cute-fantasy-rpg/Player/Player.png',
    categories: ['Animals', 'Enemies', 'Decorations', 'Player', 'Tiles'],
    totalAssets: 20
  }
];

export default function AssetPacks() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Asset Packs</h1>
            <p className="text-gray-300">Choose an asset pack to browse and use in your idle game</p>
          </div>
          <a
            href="/sprite-editor"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Open Sprite Editor
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assetPacks.map((pack) => (
            <Link
              key={pack.id}
              href={`/asset-packs/${pack.id}`}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors group"
            >
              <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={pack.image}
                  alt={pack.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{pack.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {pack.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                {pack.totalAssets} assets
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}