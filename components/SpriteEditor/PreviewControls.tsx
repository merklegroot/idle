interface PreviewControlsProps {
  zoomLevel: number;
  onZoom: (delta: number) => void;
  onResetView: () => void;
}

export default function PreviewControls({
  zoomLevel,
  onZoom,
  onResetView
}: PreviewControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onZoom(-1)}
        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded"
      >
        -
      </button>
      <span className="text-sm text-gray-300 min-w-[3rem] text-center">
        {Math.round(zoomLevel * 100)}%
      </span>
      <button
        onClick={() => onZoom(1)}
        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded"
      >
        +
      </button>
      <button
        onClick={onResetView}
        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
      >
        Reset
      </button>
    </div>
  );
}
