import useGameStore from '@/stores/gameStore';

export function CheatControl() {
    const { addResourceAmount } = useGameStore();

    const addDebugWood = () => {
        addResourceAmount('wood', 10);
    };

    const addDebugBerries = () => {
        addResourceAmount('berries', 10);
    };

    return (
        <>
            <button
                onClick={addDebugWood}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                +10 Wood (Debug)
            </button>
            <button
                onClick={addDebugBerries}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                +10 Berries (Debug)
            </button>
        </>
    );
}