import { User } from '@repo/types';
import { create } from 'zustand';

interface UserStoreState {
  user: User | undefined;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
