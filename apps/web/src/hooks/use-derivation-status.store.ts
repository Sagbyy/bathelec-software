import { DerivationStatus } from '@repo/types';
import { create } from 'zustand';

interface DerivationStatusStoreState {
  isCompleted: boolean;
  setIsCompleted: (isCompleted: boolean) => void;
}

export const useDerivationStatusStore = create<DerivationStatusStoreState>(
  (set) => ({
    isCompleted: false,
    setIsCompleted: (isCompleted) => set({ isCompleted }),
  })
);
