import { User } from '@repo/types/index';
import { create } from 'zustand';

interface UserStoreState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
