'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { calculateTotalAssets } from '../../utils/assetPackUtil';

interface AssetPack {
  id: string;
  name: string;
  description: string;
  image: { url: string } | { emoji: string };
  categories: string[];
  totalAssets: number;
}

export default function AssetPacks() {
  const [assetPacks, setAssetPacks] = useState<AssetPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssetPacks = async () => {
      try {
        const response = await fetch('/api/asset-packs');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const packs = data.assetPacks.map((pack: any) => ({
              ...pack,
              totalAssets: calculateTotalAssets(pack.id)
            }));
            setAssetPacks(packs);
          }
        }
      } catch (error) {
        console.error('Error loading asset packs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAssetPacks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading asset packs...</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Asset Packs</h1>
            <p className="text-gray-300">Choose an asset pack to browse and use in your idle game</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/asset-pack-details"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Create New Asset Pack
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assetPacks.map((pack) => (
            <Link
              key={pack.id}
              href={`/asset-pack-details/${pack.id}`}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors group"
            >
              <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {pack.image ? (
                  'emoji' in pack.image ? (
                    // Emoji - display as large text
                    <div className="text-8xl group-hover:scale-110 transition-transform">
                      {pack.image.emoji}
                    </div>
                  ) : (
                    // URL - display as image
                    <img
                      src={pack.image.url}
                      alt={pack.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )
                ) : (
                  <div className="text-gray-400 text-4xl">
                    📦
                  </div>
                )}
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