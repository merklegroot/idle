'use client';

import { useState, useEffect } from 'react';

interface AssetFile {
  name: string;
  path: string;
  type: 'image' | 'directory';
  files?: AssetFile[];
}

interface AssetCategory {
  title: string;
  icon: string;
  files: AssetFile[];
}

export default function AssetShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAssets, setHasAssets] = useState(false);

  // Check if assets are available
  useEffect(() => {
    const checkAssets = async () => {
      try {
        const response = await fetch('/api/assets/scan');
        if (response.ok) {
          const data = await response.json();
          setAssetCategories(data.categories || []);
          setHasAssets(data.hasAssets || false);
        }
      } catch (error) {
        console.log('Assets not available yet');
      }
    };

    if (isOpen) {
      checkAssets();
    }
  }, [isOpen]);

  // Fallback data when assets aren't available
  const fallbackAssets: AssetCategory[] = [
    {
      title: "Characters",
      icon: "🧙",
      files: []
    },
    {
      title: "Environment", 
      icon: "🌍",
      files: []
    },
    {
      title: "Enemies",
      icon: "👹", 
      files: []
    },
    {
      title: "Animals",
      icon: "🐄",
      files: []
    },
    {
      title: "Buildings",
      icon: "🏠",
      files: []
    },
    {
      title: "Items & Resources",
      icon: "⚔️",
      files: []
    }
  ];

  const displayAssets = hasAssets ? assetCategories : fallbackAssets;

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
              {hasAssets 
                ? "Assets are loaded and ready to use in your game!"
                : "Assets need to be downloaded and placed in the public/assets/cute-fantasy-rpg/ directory."
              }
            </p>
          </div>

          {hasAssets ? (
            displayAssets.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.title}
                  <span className="text-sm text-gray-400">
                    ({category.files.reduce((total, file) => 
                      total + (file.type === 'directory' && file.files ? file.files.length : 1), 0
                    )} files)
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {category.files.map((file, fileIndex) => (
                    <div key={fileIndex} className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
                      {file.type === 'image' ? (
                        <div className="mb-2">
                          <img 
                            src={file.path} 
                            alt={file.name}
                            className="w-full h-16 object-cover rounded bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(file.path, '_blank')}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling!.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-16 bg-gray-700 rounded flex items-center justify-center text-2xl hidden">
                            🖼️
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-16 bg-gray-700 rounded flex items-center justify-center text-2xl mb-2">
                          📁
                        </div>
                      )}
                      <div className="text-xs text-gray-300 truncate" title={file.name}>
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-6">
              {displayAssets.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.title}
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl">
                        📁
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Asset files not found</h4>
                        <p className="text-sm text-gray-400">Download and run setup to see assets</p>
                      </div>
                    </div>
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
                  <li>3. Place the zip file in: <code className="bg-gray-700 px-1 rounded">downloads/</code></li>
                  <li>4. Run: <code className="bg-gray-700 px-1 rounded">npm run setup-assets</code></li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
