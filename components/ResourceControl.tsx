'use client';

import { ResourceDef } from '@/app/models/ResourceDef';

interface ResourceControlProps {
  resourceDef: ResourceDef;
}

export default function ResourceControl({ resourceDef }: ResourceControlProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{resourceDef.icon}</span>
        <span className="font-semibold">{resourceDef.name}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2">Resource: {resourceDef.resourceKey}</p>
    </div>
  );
}

