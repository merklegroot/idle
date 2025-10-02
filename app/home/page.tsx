'use client';

import WoodControl from '../../components/WoodControl';

export default function Home() {

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">Home</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WoodControl />
        </div>
      </div>
    </div>
  );
}
