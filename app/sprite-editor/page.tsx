'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SpriteEditorMain from '@/components/SpriteEditor/SpriteEditorMain';

export default function SpriteEditor() {
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<{ src: string; name: string } | null>(null);

  // Handle URL parameters for pre-selecting an image
  useEffect(() => {
    const imageParam = searchParams.get('image');
    const nameParam = searchParams.get('name');
    
    if (imageParam && nameParam) {
      setSelectedImage({ src: imageParam, name: nameParam });
    }
  }, [searchParams]);

  return <SpriteEditorMain selectedImage={selectedImage} />;
}
