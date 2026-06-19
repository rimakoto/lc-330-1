import { create } from 'zustand';
import type { MovementType, GearConfig, MovementConfig } from '../types';
import { MOVEMENTS } from '../data/movements';

interface WatchStore {
  movementType: MovementType;
  setMovementType: (t: MovementType) => void;
  timeScale: number;
  setTimeScale: (s: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  setPlaying: (p: boolean) => void;
  selectedGearId: string | null;
  setSelectedGearId: (id: string | null) => void;
  getGearConfig: (id: string) => GearConfig | undefined;
  getCurrentMovement: () => MovementConfig;
}

export const useWatchStore = create<WatchStore>((set, get) => ({
  movementType: 'swiss-lever',
  timeScale: 1,
  isPlaying: true,
  selectedGearId: null,

  setMovementType: (t: MovementType) =>
    set({ movementType: t, selectedGearId: null }),

  setTimeScale: (s: number) => set({ timeScale: Math.max(0.1, Math.min(50, s)) }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaying: (p: boolean) => set({ isPlaying: p }),

  setSelectedGearId: (id: string | null) => set({ selectedGearId: id }),

  getGearConfig: (id: string) => {
    const mv = MOVEMENTS[get().movementType];
    return mv.gears.find((g) => g.id === id);
  },

  getCurrentMovement: () => MOVEMENTS[get().movementType],
}));
