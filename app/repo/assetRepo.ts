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

export const assetRepo = {
    list
};