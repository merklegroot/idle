import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AssetPack {
  id: string;
  name: string;
  description: string;
  image: string;
  categories: string[];
}

interface AssetPacksResponse {
  success: boolean;
  message?: string;
  assetPacks: AssetPack[];
}

const ASSET_PACKS_FILE = path.join(process.cwd(), 'lib', 'data', 'asset-packs.json');

export async function GET(): Promise<NextResponse<AssetPacksResponse>> {
  try {
    if (!fs.existsSync(ASSET_PACKS_FILE)) {
      return NextResponse.json({
        success: false,
        message: 'Asset packs file not found',
        assetPacks: []
      });
    }

    const fileContent = fs.readFileSync(ASSET_PACKS_FILE, 'utf8');
    const assetPacks: AssetPack[] = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      assetPacks
    });

  } catch (error) {
    console.error('Error reading asset packs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to read asset packs',
      assetPacks: []
    }, { status: 500 });
  }
}
