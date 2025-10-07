'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SpriteEditorMain from '@/components/SpriteEditor/SpriteEditorMain';

export default function SpriteEditor() {
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<{ src: string; name: string; assetPack?: string; category?: string } | null>(null);

  // Handle URL parameters for pre-selecting an image
  useEffect(() => {
    const imageParam = searchParams.get('image');
    const nameParam = searchParams.get('name');
    
    if (imageParam && nameParam) {
      // Extract asset pack and category from the image path
      const pathParts = imageParam.split('/');
      const assetPack = pathParts[2] || 'Unknown'; // /assets/cute-fantasy-rpg/...
      const category = pathParts[3] || 'Unknown'; // /assets/cute-fantasy-rpg/Animals/...
      
      setSelectedImage({ 
        src: imageParam, 
        name: nameParam,
        assetPack,
        category
      });
    }
  }, [searchParams]);

  return <SpriteEditorMain selectedImage={selectedImage} />;
}
