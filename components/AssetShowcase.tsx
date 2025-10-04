'use client';

import { useState } from 'react';

interface AssetItem {
  name: string;
  category: string;
  description: string;
  preview?: string; // Path to preview image
  isPlaceholder?: boolean;
}

interface AssetCategory {
  title: string;
  icon: string;
  items: AssetItem[];
}

export default function AssetShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  // Placeholder data for Cute Fantasy RPG assets
  const cuteFantasyAssets: AssetCategory[] = [
    {
      title: "Characters",
      icon: "🧙",
      items: [
        { name: "Player Sprites", category: "character", description: "Main character with walking, idling, attacking animations" },
        { name: "NPCs", category: "character", description: "Various NPC characters for towns and interactions" },
        { name: "Player Generator", category: "character", description: "Tool for creating custom characters" }
      ]
    },
    {
      title: "Environment",
      icon: "🌍",
      items: [
        { name: "Grass Tiles", category: "tile", description: "Various grass and ground tiles" },
        { name: "Water Tiles", category: "tile", description: "Water, rivers, and water features" },
        { name: "Path Tiles", category: "tile", description: "Roads, paths, and walkways" },
        { name: "Cliff Tiles", category: "tile", description: "Cliff and elevation tiles" },
        { name: "Beach Tiles", category: "tile", description: "Coastal and beach environments" },
        { name: "Cave Tiles", category: "tile", description: "Underground cave systems" }
      ]
    },
    {
      title: "Enemies",
      icon: "👹",
      items: [
        { name: "Skeleton Enemies", category: "enemy", description: "Various skeleton enemy types" },
        { name: "Slime Enemies", category: "enemy", description: "Slime creatures with animations" },
        { name: "Bombshroom", category: "enemy", description: "Explosive mushroom enemies" }
      ]
    },
    {
      title: "Animals",
      icon: "🐄",
      items: [
        { name: "Farm Animals", category: "animal", description: "Horse, Cow, Pig, Chicken, Sheep" },
        { name: "Wild Animals", category: "animal", description: "Bee, Duck, Frog, Goose, Mouse, Swan" }
      ]
    },
    {
      title: "Buildings",
      icon: "🏠",
      items: [
        { name: "Houses", category: "building", description: "Various house and building sprites" },
        { name: "Furniture", category: "building", description: "Interior furniture and decorations" },
        { name: "Workstations", category: "building", description: "Crafting and work stations" }
      ]
    },
    {
      title: "Items & Resources",
      icon: "⚔️",
      items: [
        { name: "Tools", category: "item", description: "Weapons, tools, and equipment" },
        { name: "Crops", category: "item", description: "Various crops and plants" },
        { name: "Ores", category: "item", description: "Mining resources and materials" },
        { name: "Item Icons", category: "item", description: "UI icons for inventory and menus" }
      ]
    }
  ];

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-2xl font-bold text-white mb-4 hover:text-gray-300 transition-colors"
      >
        <span className="text-3xl">🎨</span>
        <span>Pixel Art Assets (Cute Fantasy RPG)</span>
        <span className="text-xl">{isOpen ? '▼' : '▶'}</span>
      </button>
      
      {isOpen && (
        <div className="space-y-8">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">ℹ️</span>
              <span className="font-semibold text-blue-300">Asset Pack Information</span>
            </div>
            <p className="text-gray-300 text-sm">
              <strong>Artist:</strong> Kenmi | 
              <strong> License:</strong> Free (Non-commercial) | 
              <strong> Source:</strong> <a href="https://kenmi-art.itch.io/cute-fantasy-rpg" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">itch.io</a>
            </p>
            <p className="text-gray-400 text-xs mt-1">
              This is the standard (free) version of the Cute Fantasy RPG asset pack. 
              Assets need to be downloaded and placed in the public/assets/cute-fantasy-rpg/ directory.
            </p>
          </div>

          {cuteFantasyAssets.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl">
                        {item.isPlaceholder ? '📁' : '🖼️'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{item.description}</p>
                    {item.isPlaceholder && (
                      <div className="mt-2 text-xs text-yellow-400">
                        ⚠️ Asset files need to be downloaded
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400">📥</span>
              <span className="font-semibold text-yellow-300">Download Instructions</span>
            </div>
            <ol className="text-gray-300 text-sm space-y-1 ml-4">
              <li>1. Visit <a href="https://kenmi-art.itch.io/cute-fantasy-rpg" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">the asset pack page</a></li>
              <li>2. Download the <strong>free version</strong> (Cute_Fantasy_Free.zip)</li>
              <li>3. Extract files to: <code className="bg-gray-700 px-1 rounded">public/assets/cute-fantasy-rpg/</code></li>
              <li>4. Assets will automatically appear in the game</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
