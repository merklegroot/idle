'use client';

export default function Credits() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Credits & Attributions</h1>
        
        <div className="space-y-8">
          {/* Cute Fantasy RPG Assets */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🎨</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Cute Fantasy RPG Asset Pack</h2>
                <p className="text-gray-300">16x16 top down pixel art assets</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Artist Information</h3>
                <ul className="space-y-1 text-gray-300">
                  <li><strong>Artist:</strong> Kenmi</li>
                  <li><strong>Website:</strong> <a href="https://kenmi-art.itch.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">kenmi-art.itch.io</a></li>
                  <li><strong>Asset Pack:</strong> <a href="https://kenmi-art.itch.io/cute-fantasy-rpg" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Cute Fantasy RPG</a></li>
                  <li><strong>Version Used:</strong> Standard (Free) Version</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">License Information</h3>
                <ul className="space-y-1 text-gray-300">
                  <li><strong>License Type:</strong> Free Version License</li>
                  <li><strong>Commercial Use:</strong> ❌ Not allowed</li>
                  <li><strong>Modification:</strong> ✅ Allowed</li>
                  <li><strong>Redistribution:</strong> ❌ Not allowed</li>
                  <li><strong>Attribution Required:</strong> ✅ Yes</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-300 mb-2">Attribution Statement</h4>
              <p className="text-gray-300 text-sm">
                This project uses pixel art assets from the "Cute Fantasy RPG" asset pack by Kenmi. 
                The assets are used under the free license terms and are credited to their original creator.
              </p>
            </div>
          </div>

          {/* Game Development */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🎮</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Game Development</h2>
                <p className="text-gray-300">Idle Game Project</p>
              </div>
            </div>
            
            <div className="text-gray-300">
              <p className="mb-4">
                This idle game is built using modern web technologies including Next.js, React, and TypeScript.
                The game features resource management, town building, and various gameplay mechanics.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-2">Technologies Used</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <li>• Next.js 14</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Zustand (State Management)</li>
                <li>• Pixel Art Assets</li>
              </ul>
            </div>
          </div>

          {/* License Summary */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-300 mb-4">License Summary</h2>
            <div className="text-gray-300 space-y-2">
              <p>
                This project is for <strong>non-commercial use only</strong> due to the licensing terms of the 
                Cute Fantasy RPG asset pack. All pixel art assets are properly attributed to their creator, Kenmi.
              </p>
              <p>
                For commercial use, you would need to purchase the premium version of the asset pack or use 
                assets with commercial licensing terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
