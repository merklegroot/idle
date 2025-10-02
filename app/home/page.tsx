'use client';

import { CheatControl } from '@/components/CheatControl';
import { GatherControl } from '@/components/GatherControl';

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Home</h1>
          <div className="flex gap-2">
            <CheatControl />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GatherControl />
        </div>
      </div>
    </div>
  );
}
