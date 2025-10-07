'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SpriteEditorMain from '@/components/SpriteEditor/SpriteEditorMain';

// Asset data for fetching by packId and assetId
const assetPacks = {
  'cute-fantasy-rpg': {
    name: 'Cute Fantasy RPG',
    assets: {
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
    }
  },
  'emoji-assets': {
    name: 'Emoji Assets',
    assets: {
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
    }
  }
};

// Function to find asset by packId and assetId
function findAssetByPackAndId(packId: string, assetId: string) {
  const pack = assetPacks[packId as keyof typeof assetPacks];
  if (!pack) return null;

  for (const [category, assets] of Object.entries(pack.assets)) {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      return {
        ...asset,
        category,
        packId,
        packName: pack.name
      };
    }
  }
  return null;
}

export default function SpriteEditor() {
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<{ src: string; name: string; assetPack?: string; category?: string } | null>(null);

  // Handle URL parameters for pre-selecting an image
  useEffect(() => {
    const imageParam = searchParams.get('image');
    const nameParam = searchParams.get('name');
    const packIdParam = searchParams.get('packId');
    const assetIdParam = searchParams.get('assetId');
    
    // Handle new clean URL format: ?packId=...&assetId=...
    if (packIdParam && assetIdParam) {
      const asset = findAssetByPackAndId(packIdParam, assetIdParam);
      if (asset) {
        if ('path' in asset) {
          // Sprite asset
          setSelectedImage({
            src: asset.path,
            name: asset.name,
            assetPack: asset.packName,
            category: asset.category,
            assetId: asset.id
          });
        } else if ('icon' in asset) {
          // Emoji asset - we can't directly edit emojis in the sprite editor
          // but we can show a placeholder or redirect
          console.warn('Emoji assets cannot be edited in the sprite editor');
          setSelectedImage(null);
        }
      }
    }
    // Handle legacy URL format: ?image=...&name=...
    else if (imageParam && nameParam) {
      // Extract asset pack and category from the image path
      const pathParts = imageParam.split('/');
      const assetPack = pathParts[2] || 'Unknown'; // /assets/cute-fantasy-rpg/...
      const category = pathParts[3] || 'Unknown'; // /assets/cute-fantasy-rpg/Animals/...
      
      setSelectedImage({ 
        src: imageParam, 
        name: nameParam,
        assetPack,
        category
      });
    }
  }, [searchParams]);

  return <SpriteEditorMain selectedImage={selectedImage} />;
}
