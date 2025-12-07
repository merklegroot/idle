'use client'

interface DebugControlsProps {
  shouldShowGrid: boolean;
  setShouldShowGrid: (show: boolean) => void;
  shouldShowTileLetters: boolean;
  setShouldShowTileLetters: (show: boolean) => void;
  shouldShowTileVariants: boolean;
  setShouldShowTileVariants: (show: boolean) => void;
  isDebugMode: boolean;
  setIsDebugMode: (show: boolean) => void;
  hasSelectedTile: boolean;
  onClearSelection: () => void;
}

export default function DebugControls({
  shouldShowGrid,
  setShouldShowGrid,
  shouldShowTileLetters,
  setShouldShowTileLetters,
  shouldShowTileVariants,
  setShouldShowTileVariants,
  isDebugMode,
  setIsDebugMode,
  hasSelectedTile,
  onClearSelection
}: DebugControlsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => setShouldShowGrid(!shouldShowGrid)}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${shouldShowGrid
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
      >
        {shouldShowGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
      <button
        onClick={() => setShouldShowTileLetters(!shouldShowTileLetters)}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${shouldShowTileLetters
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
      >
        {shouldShowTileLetters ? 'Hide Letters' : 'Show Letters'}
      </button>
      <button
        onClick={() => setShouldShowTileVariants(!shouldShowTileVariants)}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${shouldShowTileVariants
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
      >
        {shouldShowTileVariants ? 'Hide Variants' : 'Show Variants'}
      </button>
      <button
        onClick={() => setIsDebugMode(!isDebugMode)}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${isDebugMode
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
      >
        {isDebugMode ? 'Hide Debug' : 'Show Debug'}
      </button>
      {hasSelectedTile && (
        <button
          onClick={onClearSelection}
          className="px-4 py-2 rounded-lg font-semibold transition-colors text-sm bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Clear Selection
        </button>
      )}
    </div>
  );
}

