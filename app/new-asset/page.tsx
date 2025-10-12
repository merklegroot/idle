'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NewAssetPackFormData {
  id: string;
  name: string;
  description: string;
  image: string;
  categories: string[];
}

export default function NewAssetPackPage() {
  const [formData, setFormData] = useState<NewAssetPackFormData>({
    id: '',
    name: '',
    description: '',
    image: '',
    categories: []
  });
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/asset-packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Asset pack created successfully!' });
        setFormData({
          id: '',
          name: '',
          description: '',
          image: '',
          categories: []
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create asset pack' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while creating the asset pack' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/asset-packs"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Asset Packs
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Asset Pack</h1>
          <p className="text-gray-300">Define a new collection of assets for your idle game</p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pack ID */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-2">
                Pack ID *
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="e.g., medieval-fantasy"
              />
              <p className="text-xs text-gray-400 mt-1">
                Unique identifier for the asset pack (lowercase, hyphens allowed)
              </p>
            </div>

            {/* Pack Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Pack Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="e.g., Medieval Fantasy"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="Describe what this asset pack contains..."
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                Preview Image *
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="e.g., /assets/medieval-fantasy/preview.png or 🏰"
              />
              <p className="text-xs text-gray-400 mt-1">
                Image path or emoji to represent this pack
              </p>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categories *
              </label>
              <div className="space-y-3">
                {/* Add Category */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Buildings, Characters, Items"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {/* Category List */}
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-sm"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="text-purple-400 hover:text-purple-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Categories help organize assets within the pack
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || formData.categories.length === 0}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Creating...' : 'Create Asset Pack'}
              </button>
              <Link
                href="/asset-packs"
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/20 text-green-400 border border-green-800' 
                : 'bg-red-900/20 text-red-400 border border-red-800'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">About Asset Packs</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-purple-400">Pack ID:</strong> Must be unique across all packs. Use lowercase letters, numbers, and hyphens only.
            </p>
            <p>
              <strong className="text-purple-400">Pack Name:</strong> Display name shown in the UI. Can contain spaces and special characters.
            </p>
            <p>
              <strong className="text-purple-400">Description:</strong> Helps users understand what assets are included in this pack.
            </p>
            <p>
              <strong className="text-purple-400">Preview Image:</strong> Can be a file path to an image or an emoji that represents the pack.
            </p>
            <p>
              <strong className="text-purple-400">Categories:</strong> Define the types of assets this pack will contain. Examples: Buildings, Characters, Items, etc.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Note: After creating the pack, you can add individual assets to it through the asset creation page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
