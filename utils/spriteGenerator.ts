interface SliceDefinition {
  id: string;
  imagePath: string;
  imageName: string;
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
}

export interface GeneratedSprite {
  id: string;
  name: string;
  path: string;
  width: number;
  height: number;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
}

export interface SpriteSheet {
  id: string;
  name: string;
  imagePath: string;
  sprites: GeneratedSprite[];
  definition: SliceDefinition;
}

/**
 * Generate sprite data from a slice definition
 */
export function generateSpritesFromDefinition(definition: SliceDefinition): SpriteSheet {
  const sprites: GeneratedSprite[] = [];
  
  // Calculate how many sprites we can fit
  const { gridWidth, gridHeight, offsetX, offsetY, spacingX, spacingY } = definition;
  
  // Safety checks to prevent crashes
  if (gridWidth <= 0 || gridHeight <= 0) {
    console.warn('Invalid grid dimensions in definition:', definition);
    return {
      id: definition.id,
      name: definition.imageName,
      imagePath: definition.imagePath,
      sprites: [],
      definition
    };
  }
  
  // For now, we'll assume a standard image size - in a real implementation,
  // you'd load the image to get actual dimensions
  const imageWidth = 1024; // This should be loaded from the actual image
  const imageHeight = 1024;
  
  const availableWidth = imageWidth - offsetX;
  const availableHeight = imageHeight - offsetY;
  
  // Additional safety checks
  if (availableWidth <= 0 || availableHeight <= 0) {
    console.warn('Invalid available dimensions:', { availableWidth, availableHeight, offsetX, offsetY });
    return {
      id: definition.id,
      name: definition.imageName,
      imagePath: definition.imagePath,
      sprites: [],
      definition
    };
  }
  
  const cols = Math.floor((availableWidth + spacingX) / (gridWidth + spacingX));
  const rows = Math.floor((availableHeight + spacingY) / (gridHeight + spacingY));
  
  // Prevent infinite loops
  if (cols <= 0 || rows <= 0 || cols > 1000 || rows > 1000) {
    console.warn('Invalid grid calculation:', { cols, rows, gridWidth, gridHeight, spacingX, spacingY });
    return {
      id: definition.id,
      name: definition.imageName,
      imagePath: definition.imagePath,
      sprites: [],
      definition
    };
  }
  
  let spriteIndex = 0;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sourceX = offsetX + col * (gridWidth + spacingX);
      const sourceY = offsetY + row * (gridHeight + spacingY);
      
      // Check if this sprite is within bounds
      if (sourceX + gridWidth <= imageWidth && sourceY + gridHeight <= imageHeight) {
        sprites.push({
          id: `${definition.id}_sprite_${spriteIndex}`,
          name: `${definition.imageName}_sprite_${spriteIndex + 1}`,
          path: `${definition.imagePath}#sprite_${spriteIndex}`,
          width: gridWidth,
          height: gridHeight,
          sourceX,
          sourceY,
          sourceWidth: gridWidth,
          sourceHeight: gridHeight
        });
        spriteIndex++;
      }
    }
  }
  
  return {
    id: definition.id,
    name: definition.imageName,
    imagePath: definition.imagePath,
    sprites,
    definition
  };
}

/**
 * Generate all sprites from saved definitions
 */
export async function generateAllSprites(): Promise<SpriteSheet[]> {
  try {
    const response = await fetch('/api/assets/slice-definitions');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to load definitions');
    }
    
    return data.definitions.map((definition: SliceDefinition) => 
      generateSpritesFromDefinition(definition)
    );
  } catch (error) {
    console.error('Error generating sprites:', error);
    return [];
  }
}

/**
 * Generate a sprite sheet definition for use in the game
 */
export function generateSpriteSheetDefinition(spriteSheet: SpriteSheet): string {
  const { name, imagePath, sprites, definition } = spriteSheet;
  
  return `
// Generated sprite sheet: ${name}
export const ${name.replace(/[^a-zA-Z0-9]/g, '_')}SpriteSheet = {
  imagePath: '${imagePath}',
  gridWidth: ${definition.gridWidth},
  gridHeight: ${definition.gridHeight},
  offsetX: ${definition.offsetX},
  offsetY: ${definition.offsetY},
  spacingX: ${definition.spacingX},
  spacingY: ${definition.spacingY},
  sprites: [
${sprites.map(sprite => `    {
      id: '${sprite.id}',
      name: '${sprite.name}',
      sourceX: ${sprite.sourceX},
      sourceY: ${sprite.sourceY},
      width: ${sprite.width},
      height: ${sprite.height}
    }`).join(',\n')}
  ]
};
`;
}

/**
 * Generate a complete sprite definitions file
 */
export async function generateSpriteDefinitionsFile(): Promise<string> {
  const spriteSheets = await generateAllSprites();
  
  const header = `// Auto-generated sprite definitions
// Generated on: ${new Date().toISOString()}
// This file contains sprite sheet definitions for the idle game

`;

  const imports = `import { SpriteSheet } from '@/types/spriteTypes';

`;

  const definitions = spriteSheets.map(spriteSheet => 
    generateSpriteSheetDefinition(spriteSheet)
  ).join('\n');

  const footer = `
// Export all sprite sheets
export const allSpriteSheets: SpriteSheet[] = [
${spriteSheets.map(sheet => `  ${sheet.name.replace(/[^a-zA-Z0-9]/g, '_')}SpriteSheet`).join(',\n')}
];
`;

  return header + imports + definitions + footer;
}
