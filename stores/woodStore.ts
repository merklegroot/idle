import { create } from 'zustand';

interface WoodState {
  amount: number;
  perSecond: number;
  workers: number;
  workerCost: number;
  isGathering: boolean;
  gatherProgress: number;
  workerProgress: number;
}

interface WoodActions {
  setAmount: (amount: number) => void;
  addAmount: (amount: number) => void;
  setPerSecond: (perSecond: number) => void;
  setWorkers: (workers: number) => void;
  setWorkerCost: (cost: number) => void;
  setIsGathering: (isGathering: boolean) => void;
  setGatherProgress: (progress: number) => void;
  setWorkerProgress: (progress: number) => void;
  hireWorker: () => void;
  startGathering: () => void;
  resetGatherProgress: () => void;
  resetWorkerProgress: () => void;
}

type WoodStore = WoodState & WoodActions;

const useWoodStore = create<WoodStore>((set, get) => ({
  // Initial state
  amount: 0,
  perSecond: 0,
  workers: 0,
  workerCost: 10,
  isGathering: false,
  gatherProgress: 0,
  workerProgress: 0,

  // Actions
  setAmount: (amount) => set({ amount }),
  addAmount: (amount) => set((state) => ({ amount: state.amount + amount })),
  setPerSecond: (perSecond) => set({ perSecond }),
  setWorkers: (workers) => set({ workers }),
  setWorkerCost: (workerCost) => set({ workerCost }),
  setIsGathering: (isGathering) => set({ isGathering }),
  setGatherProgress: (gatherProgress) => set({ gatherProgress }),
  setWorkerProgress: (workerProgress) => set({ workerProgress }),

  hireWorker: () => {
    const state = get();
    if (state.amount >= state.workerCost) {
      set({
        amount: state.amount - state.workerCost,
        workers: state.workers + 1,
        perSecond: state.perSecond + 1,
        workerCost: Math.floor(state.workerCost * 1.15)
      });
    }
  },

  startGathering: () => {
    const state = get();
    if (!state.isGathering) {
      set({
        isGathering: true,
        gatherProgress: 0
      });
    }
  },

  resetGatherProgress: () => set({ isGathering: false, gatherProgress: 0 }),
  resetWorkerProgress: () => set({ workerProgress: 0 }),
}));

export default useWoodStore;
