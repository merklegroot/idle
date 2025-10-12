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

interface CreateAssetPackRequest {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  categories?: string[];
}

interface UpdateAssetPackRequest {
  name?: string;
  description?: string;
  image?: string;
  categories?: string[];
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

export async function POST(request: Request): Promise<NextResponse<{ success: boolean; message?: string; assetPack?: AssetPack }>> {
  try {
    const body: CreateAssetPackRequest = await request.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json({
        success: false,
        message: 'Missing required field: id'
      }, { status: 400 });
    }

    // Validate pack ID format
    if (!/^[a-z0-9-]+$/.test(body.id)) {
      return NextResponse.json({
        success: false,
        message: 'Pack ID must contain only lowercase letters, numbers, and hyphens'
      }, { status: 400 });
    }

    if (!fs.existsSync(ASSET_PACKS_FILE)) {
      return NextResponse.json({
        success: false,
        message: 'Asset packs file not found'
      }, { status: 500 });
    }

    const fileContent = fs.readFileSync(ASSET_PACKS_FILE, 'utf8');
    const assetPacks: AssetPack[] = JSON.parse(fileContent);

    // Check if pack ID already exists
    if (assetPacks.some(pack => pack.id === body.id)) {
      return NextResponse.json({
        success: false,
        message: 'Asset pack with this ID already exists'
      }, { status: 400 });
    }

    const newAssetPack: AssetPack = {
      id: body.id,
      name: body.name || '',
      description: body.description || '',
      image: body.image || '',
      categories: body.categories || []
    };

    assetPacks.push(newAssetPack);

    // Write back to file
    fs.writeFileSync(ASSET_PACKS_FILE, JSON.stringify(assetPacks, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Asset pack created successfully',
      assetPack: newAssetPack
    });

  } catch (error) {
    console.error('Error creating asset pack:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create asset pack'
    }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse<{ success: boolean; message?: string; assetPack?: AssetPack }>> {
  try {
    const { searchParams } = new URL(request.url);
    const packId = searchParams.get('id');
    
    if (!packId) {
      return NextResponse.json({
        success: false,
        message: 'Missing pack ID'
      }, { status: 400 });
    }

    const body: UpdateAssetPackRequest = await request.json();

    if (!fs.existsSync(ASSET_PACKS_FILE)) {
      return NextResponse.json({
        success: false,
        message: 'Asset packs file not found'
      }, { status: 500 });
    }

    const fileContent = fs.readFileSync(ASSET_PACKS_FILE, 'utf8');
    const assetPacks: AssetPack[] = JSON.parse(fileContent);

    const packIndex = assetPacks.findIndex(pack => pack.id === packId);
    if (packIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Asset pack not found'
      }, { status: 404 });
    }

    // Update the pack with provided fields
    const updatedPack: AssetPack = {
      ...assetPacks[packIndex],
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.categories !== undefined && { categories: body.categories })
    };

    assetPacks[packIndex] = updatedPack;

    // Write back to file
    fs.writeFileSync(ASSET_PACKS_FILE, JSON.stringify(assetPacks, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Asset pack updated successfully',
      assetPack: updatedPack
    });

  } catch (error) {
    console.error('Error updating asset pack:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update asset pack'
    }, { status: 500 });
  }
}
