export type assetPackPreviewImage = { url: string } | { emoji: string };

export interface AssetPack {
  id: string;
  name: string;
  description: string;
  image: assetPackPreviewImage;
  categories: string[];
};
