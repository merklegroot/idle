'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { calculateTotalAssets } from '../../../utils/assetPackUtil';
import { AssetPack } from '@/app/models/AssetPack';
import { Asset } from '@/app/models/Asset';


export default function AssetPackDetails() {
  const params = useParams();
  const packId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isCreating = !packId || packId === '';
  const [assetPack, setAssetPack] = useState<AssetPackWithTotal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingId, setEditingId] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [newId, setNewId] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [sliceDefinitions, setSliceDefinitions] = useState<any[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  interface AssetPackWithTotal extends AssetPack {
    totalAssets: number;
  }

  // Load asset packs and find the current one
  useEffect(() => {
    const loadAssetPack = async () => {
      if (isCreating) {
        // Create a new empty asset pack for creation mode
        const newPack: AssetPackWithTotal = {
          id: '',
          name: '',
          description: '',
          image: { emoji: '📦' },
          categories: [],
          totalAssets: 0,
        };
        setAssetPack(newPack);
        setNewId('');
        setNewName('');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/asset-packs');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const pack = data.assetPacks.find((p: AssetPackWithTotal) => p.id === packId);
            if (pack) {
              const packWithTotal = {
                ...pack,
                totalAssets: calculateTotalAssets(pack.id),
              };
              setAssetPack(packWithTotal);
              setSelectedCategory(pack.categories[0]);
              setNewId(pack.id);
              setNewName(pack.name);
            }
          }
        }
      } catch (error) {
        console.error('Error loading asset pack:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAssetPack();
  }, [packId, isCreating]);

  // Load assets for the current pack
  useEffect(() => {
    const loadAssets = async () => {
      if (!assetPack) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/assets?packId=${assetPack.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAssets(data.assets || []);
          }
        }
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, [assetPack]);

  // Load slice definitions
  useEffect(() => {
    const loadSliceDefinitions = async () => {
      try {
        const response = await fetch('/api/assets/slice-definitions');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSliceDefinitions(data.definitions || []);
          }
        }
      } catch (error) {
        console.error('Error loading slice definitions:', error);
      }
    };
    loadSliceDefinitions();
  }, []);

  // Function to check if an asset has been sliced
  const isAssetSliced = (assetPath: string) => {
    return sliceDefinitions.some(def => def.imagePath === assetPath);
  };

  const handleEditId = () => {
    setEditingId(true);
  };

  const handleSaveId = async () => {
    if (newId.trim() && assetPack) {
      if (isCreating) {
        // Create new asset pack
        try {
          const response = await fetch('/api/asset-packs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: newId.trim(),
              name: newName.trim() || '',
              description: assetPack.description || '',
              image: assetPack.image || { emoji: '📦' },
              categories: assetPack.categories || []
            }),
          });

          const result = await response.json();

          if (result.success) {
            // Update the URL to reflect the new ID
            window.history.replaceState(null, '', `/asset-pack-details/${newId.trim()}`);
            // Reload the page to show the created pack
            window.location.reload();
          } else {
            console.error('Failed to create asset pack:', result.message);
          }
        } catch (error) {
          console.error('Error creating asset pack:', error);
        }
      } else {
        // Update existing asset pack ID
        const updatedPack = { ...assetPack, id: newId.trim() };
        setAssetPack(updatedPack);
        setEditingId(false);
        
        // Update the URL to reflect the new ID
        window.history.replaceState(null, '', `/asset-pack-details/${newId.trim()}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setNewId(assetPack?.id || '');
    setEditingId(false);
  };

  const handleEditName = () => {
    setEditingName(true);
  };

  const handleSaveName = async () => {
    if (newName.trim() && assetPack) {
      try {
        const response = await fetch(`/api/asset-packs?id=${assetPack.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newName.trim() }),
        });

        const result = await response.json();

        if (result.success) {
          setAssetPack(prev => prev ? { ...prev, name: newName.trim() } : null);
          setEditingName(false);
        } else {
          console.error('Failed to update name:', result.message);
        }
      } catch (error) {
        console.error('Error updating name:', error);
      }
    }
  };

  const handleCancelNameEdit = () => {
    setNewName(assetPack?.name || '');
    setEditingName(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading asset pack...</div>
          </div>
        </div>
      </div>
    );
  }

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

  // Filter assets by selected category
  const currentAssets = assets.filter(asset => asset.category === selectedCategory);
  const isEmojiPack = assetPack.id === 'emoji-assets';

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
            {editingName ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-4xl font-bold text-white bg-gray-700 px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter asset pack name"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelNameEdit}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {isCreating ? 'Create New Asset Pack' : assetPack.name}
                </h1>
                {!isCreating && (
                  <button
                    onClick={handleEditName}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Edit Name
                  </button>
                )}
              </div>
            )}
            <p className="text-gray-300">
              {isCreating ? 'Define your new asset pack' : assetPack.description}
            </p>
          </div>
          <div className="flex gap-3">
            {!isCreating && (
              <Link
                href="/asset-pack-details"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Create New Asset Pack
              </Link>
            )}
          </div>
        </div>

        {/* Category Navigation */}
        {!isCreating && (
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
        )}

        {/* Assets Grid */}
        {!isCreating && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{selectedCategory}</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading assets...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {currentAssets.map((asset, index) => (
                  <div
                    key={asset.id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors group cursor-pointer"
                    onClick={() => {
                      // Navigate directly to sprite editor with clean URL
                      window.location.href = `/sprite-editor?packId=${assetPack.id}&assetId=${asset.id}`;
                    }}
                    title="Click to open in Sprite Editor"
                  >
                    <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {isEmojiPack ? (
                        <div className="text-6xl group-hover:scale-110 transition-transform">
                          {asset.icon}
                        </div>
                      ) : (
                        <img
                          src={asset.path}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-300 text-center mb-2">{asset.name}</div>
                    
                    {/* Slicing Status Indicator */}
                    {!isEmojiPack && asset.path && (
                      <div className="mb-2">
                        {isAssetSliced(asset.path) ? (
                          <div className="flex items-center justify-center gap-1 text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                            <span>✓</span>
                            <span>Sliced</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
                            <span>○</span>
                            <span>Not Sliced</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div 
                      className="text-xs text-purple-400 text-center cursor-pointer hover:text-purple-300 transition-colors font-mono bg-gray-700 px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening sprite editor when clicking ID
                        navigator.clipboard.writeText(asset.id);
                      }}
                      title="Click to copy ID"
                    >
                      {asset.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Asset Pack Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="mt-6 pt-6 border-t border-gray-600">
            <h4 className="text-lg font-semibold text-gray-300 mb-2">
              {isCreating ? 'Create Asset Pack' : 'Asset Pack ID'}
            </h4>
            
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
                    {isCreating ? 'Create Pack' : 'Save'}
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
                    {assetPack.id || 'No ID set'}
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
              {isCreating ? 'Enter a unique ID for your new asset pack' : 'Use this ID to reference this asset pack in your game code'}
            </p>
          </div>

          {/* Asset Pack Information */}
          {!isCreating && (
            <div className="mt-6 pt-6 border-t border-gray-600">
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
          )}
        </div>
      </div>
    </div>
  );
}
