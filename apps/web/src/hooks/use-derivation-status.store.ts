
import { create } from 'zustand';

interface DerivationStatusStoreState {
  isNotEditable: boolean;
  setIsNotEditable: (isNotEditable: boolean) => void;
}

export const useDerivationStatusStore = create<DerivationStatusStoreState>(
  (set) => ({
    isNotEditable: false,
    setIsNotEditable: (isNotEditable) => set({ isNotEditable: isNotEditable }),
  })
);
