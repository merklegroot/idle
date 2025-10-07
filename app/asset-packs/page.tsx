'use client';

import AssetShowcase from '@/components/Assets/AssetShowcase';
import EmojiAssetsSection from '@/components/Assets/EmojiAssetsSection';

export default function AssetPacks() {

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
        <EmojiAssetsSection />

        {/* Pixel Art Assets Section */}
        <AssetShowcase />
      </div>
    </div>
  );
}