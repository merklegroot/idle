'use client';

import Equipment from '../../components/Equipment';

export default function EquipmentPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Equipment</h1>
        </div>
        
        <Equipment />
      </div>
    </div>
  );
}
