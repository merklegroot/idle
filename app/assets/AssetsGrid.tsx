export function AssetsGrid ({ title, icons }: { title: string, icons: any[] }) {
    return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {icons.map((iconDef) => (
          <div key={iconDef.resourceKey} className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-4xl mb-2">{iconDef.icon}</div>
            <div className="text-sm text-gray-300">{iconDef.name}</div>
            <div className="text-xs text-gray-500 mt-1">{iconDef.resourceKey}</div>
          </div>
        ))}
      </div>
    </div>
  );
}