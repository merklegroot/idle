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
