'use client'

import { ResourceDef, RESOURCE_DEFS } from '@/constants/ResourceDefs'

export default function ResourcesPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Resources</h1>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Resource Definitions</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {RESOURCE_DEFS.map((def: ResourceDef) => (
                            <div key={def.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">{def.icon}</span>
                                    <h3 className="text-lg font-semibold text-gray-800">{def.displayName}</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    <strong>ID:</strong> {def.id}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}