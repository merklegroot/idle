import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const ASSET_DIR = path.join(process.cwd(), 'public', 'assets', 'cute-fantasy-rpg');

function isImageFile(filename: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

function scanDirectory(dirPath: string, basePath: string = ''): AssetFile[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files: AssetFile[] = [];
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Skip certain directories
      if (['.git', 'node_modules', 'temp-extract'].includes(item)) {
        continue;
      }

      const subFiles = scanDirectory(itemPath, relativePath);
      files.push({
        name: item,
        path: `/assets/cute-fantasy-rpg/${relativePath}`,
        type: 'directory',
        files: subFiles
      });
    } else if (isImageFile(item)) {
      files.push({
        name: item,
        path: `/assets/cute-fantasy-rpg/${relativePath}`,
        type: 'image'
      });
    }
  }

  return files.sort((a, b) => {
    // Directories first, then files
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

function flattenAssets(files: AssetFile[]): AssetFile[] {
  const flattened: AssetFile[] = [];
  
  for (const file of files) {
    if (file.type === 'directory' && file.files) {
      // If it's a directory with files, check if we should flatten it
      const shouldFlatten = ['animals', 'enemies', 'player', 'outdoor decoration', 'tiles'].includes(file.name.toLowerCase());
      
      if (shouldFlatten) {
        // Flatten this directory - add all image files directly
        for (const subFile of file.files) {
          if (subFile.type === 'image') {
            flattened.push(subFile);
          } else if (subFile.type === 'directory' && subFile.files) {
            // Handle nested directories (like Animals/Chicken/)
            for (const nestedFile of subFile.files) {
              if (nestedFile.type === 'image') {
                flattened.push(nestedFile);
              }
            }
          }
        }
      } else {
        // Keep as directory structure
        flattened.push(file);
      }
    } else {
      // Individual files
      flattened.push(file);
    }
  }
  
  return flattened;
}

function categorizeAssets(files: AssetFile[]): AssetCategory[] {
  const categories: AssetCategory[] = [
    { title: "Characters", icon: "🧙", files: [] },
    { title: "Environment", icon: "🌍", files: [] },
    { title: "Enemies", icon: "👹", files: [] },
    { title: "Animals", icon: "🐄", files: [] },
    { title: "Buildings", icon: "🏠", files: [] },
    { title: "Items & Resources", icon: "⚔️", files: [] }
  ];

  // Map directory names to categories
  const categoryMap: { [key: string]: number } = {
    'player': 0, // Characters
    'characters': 0,
    'tiles': 1, // Environment
    'environment': 1,
    'outdoor decoration': 1,
    'enemies': 2, // Enemies
    'animals': 3, // Animals
    'buildings': 4, // Buildings
    'houses': 4,
    'items': 5, // Items & Resources
    'resources': 5
  };

  for (const file of files) {
    if (file.type === 'directory') {
      const categoryIndex = categoryMap[file.name.toLowerCase()];
      if (categoryIndex !== undefined) {
        // Check if this directory should be flattened
        const shouldFlatten = ['animals', 'enemies', 'player', 'outdoor decoration', 'tiles'].includes(file.name.toLowerCase());
        
        if (shouldFlatten) {
          // Add all image files directly to the category
          const imageFiles = file.files?.filter(f => f.type === 'image') || [];
          const nestedImageFiles = file.files?.filter(f => f.type === 'directory' && f.files)
            .flatMap(f => f.files?.filter(nf => nf.type === 'image') || []) || [];
          
          categories[categoryIndex].files.push(...imageFiles, ...nestedImageFiles);
        } else {
          categories[categoryIndex].files.push(file);
        }
      } else {
        // Default to environment for unknown directories
        categories[1].files.push(file);
      }
    } else {
      // Individual image files go to items & resources
      categories[5].files.push(file);
    }
  }

  // Filter out empty categories
  return categories.filter(category => category.files.length > 0);
}

export async function GET() {
  try {
    if (!fs.existsSync(ASSET_DIR)) {
      return NextResponse.json({
        hasAssets: false,
        categories: [],
        message: 'Asset directory not found'
      });
    }

    const files = scanDirectory(ASSET_DIR);
    const categories = categorizeAssets(files);
    const hasAssets = files.length > 0;

    return NextResponse.json({
      hasAssets,
      categories,
      totalFiles: files.length
    });

  } catch (error) {
    console.error('Error scanning assets:', error);
    return NextResponse.json({
      hasAssets: false,
      categories: [],
      error: 'Failed to scan assets'
    }, { status: 500 });
  }
}
