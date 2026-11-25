import { createLocalStore } from './local-store';

export interface Draft<V> {
  values: V;
  step: number;
  savedAt: number;
}

export interface DraftStore<V> {
  load: (ownerId: number, targetId: number) => Promise<Draft<V> | undefined>;
  save: (
    ownerId: number,
    targetId: number,
    draft: Omit<Draft<V>, 'savedAt'>
  ) => Promise<Draft<V>>;
  clear: (ownerId: number, targetId: number) => Promise<void>;
}

const draftKey = (ownerId: number, targetId: number) =>
  `${ownerId}:${targetId}`;

export const createDraftStore = <V>(
  name: string,
  now: () => number = Date.now
): DraftStore<V> => {
  const store = createLocalStore<Draft<V>>(name);

  return {
    load: (ownerId, targetId) => store.get(draftKey(ownerId, targetId)),
    save: async (ownerId, targetId, draft) => {
      const saved = { ...draft, savedAt: now() };
      await store.set(draftKey(ownerId, targetId), saved);
      return saved;
    },
    clear: (ownerId, targetId) => store.delete(draftKey(ownerId, targetId)),
  };
};
