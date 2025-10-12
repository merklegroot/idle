import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Asset } from '@/app/models/Asset';
import { assetRepo } from '@/app/repo/assetRepo';

interface AssetsResponse {
  success: boolean;
  message?: string;
  assets: Asset[];
  total: number;
}

interface CreateAssetRequest {
  id: string;
  name: string;
  packId: string;
  category: string;
  description?: string;
}

export async function GET(request: Request): Promise<NextResponse<AssetsResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const packId = searchParams.get('packId') || undefined;
    const category = searchParams.get('category') || undefined;

    const assets = await assetRepo.list({ packId, category });

    return NextResponse.json({
      success: true,
      assets,
      total: assets.length
    });

  } catch (error) {
    console.error('Error reading assets:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to read assets',
      assets: [],
      total: 0
    }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse<{ success: boolean; message?: string; asset?: Asset }>> {
  try {
    const body: CreateAssetRequest = await request.json();
    
    // Validate required fields
    if (!body.id || !body.name || !body.packId || !body.category) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: id, name, packId, category'
      }, { status: 400 });
    }

    // Validate asset ID format
    if (!/^[a-z0-9_]+$/.test(body.id)) {
      return NextResponse.json({
        success: false,
        message: 'Asset ID must contain only lowercase letters, numbers, and underscores'
      }, { status: 400 });
    }

    const newAsset = await assetRepo.create({
      id: body.id,
      name: body.name,
      packId: body.packId,
      category: body.category,
      description: body.description
    });

    return NextResponse.json({
      success: true,
      message: 'Asset created successfully',
      asset: newAsset
    });

  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create asset'
    }, { status: 500 });
  }
}
