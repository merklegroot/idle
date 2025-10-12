// Utility function to calculate total assets for an asset pack
export function calculateTotalAssets(packId: string): number {
  // For cute-fantasy-rpg pack, count the actual assets
  if (packId === 'cute-fantasy-rpg') {
    const cuteFantasyAssets = {
      'Animals': 4, // Chicken, Cow, Pig, Sheep
      'Enemies': 2, // Skeleton, Slime Green
      'Decorations': 7, // Bridge Wood, Chest, Fences, House, Oak Tree Small, Oak Tree, Outdoor Decor Free
      'Player': 2, // Player Actions, Player
      'Tiles': 8 // Beach Tile, Cliff Tile, FarmLand Tile, Grass Middle, Path Middle, Path Tile, Water Middle, Water Tile
    };
    return Object.values(cuteFantasyAssets).reduce((sum, count) => sum + count, 0);
  }
  
  // For emoji-assets pack, count the actual assets
  if (packId === 'emoji-assets') {
    const emojiAssets = {
      'Town Buildings': 13,
      'Land & Terrain': 10,
      'Paths & Roads': 5,
      'Camps & Settlements': 6,
      'Food & Agriculture': 10,
      'Resources': 7
    };
    return Object.values(emojiAssets).reduce((sum, count) => sum + count, 0);
  }
  
  // Default fallback
  return 0;
}
