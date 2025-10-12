import path from "path";
import fs from "fs";
import { Asset } from "../models/Asset";

const ASSETS_FILE = path.join(process.cwd(), 'lib', 'data', 'assets.json');

async function list({
    packId,
    category
}: {
    packId?: string;
    category?: string;
}): Promise<Asset[]> {
    if (!fs.existsSync(ASSETS_FILE)) {
        throw new Error('Assets file not found');
    }

    try {
        const fileContent = fs.readFileSync(ASSETS_FILE, 'utf8');
        const assetsData: Asset[] = JSON.parse(fileContent);
        let filteredAssets: Asset[] = assetsData;

        // Filter by packId if provided
        if (packId) {
            filteredAssets = filteredAssets.filter((asset: Asset) => asset.packId === packId);
        }

        // Filter by category if provided
        if (category) {
            filteredAssets = filteredAssets.filter((asset: Asset) => asset.category === category);
        }

        return filteredAssets;
    } catch (error) {
        console.error('Error reading or parsing assets file:', error);
        throw new Error('Failed to read assets file');
    }
}

async function create(assetData: {
    id: string;
    name: string;
    packId: string;
    category: string;
    description?: string;
}): Promise<Asset> {
    if (!fs.existsSync(ASSETS_FILE)) {
        throw new Error('Assets file not found');
    }

    try {
        const fileContent = fs.readFileSync(ASSETS_FILE, 'utf8');
        const assets: Asset[] = JSON.parse(fileContent);

        // Check if asset ID already exists
        if (assets.some(asset => asset.id === assetData.id)) {
            throw new Error('Asset with this ID already exists');
        }

        const newAsset: Asset = {
            id: assetData.id,
            name: assetData.name,
            packId: assetData.packId,
            category: assetData.category,
            description: assetData.description
        };

        assets.push(newAsset);

        // Write back to file
        fs.writeFileSync(ASSETS_FILE, JSON.stringify(assets, null, 2), 'utf8');

        return newAsset;
    } catch (error) {
        console.error('Error creating asset:', error);
        throw new Error('Failed to create asset');
    }
}

export const assetRepo = {
    list,
    create
};