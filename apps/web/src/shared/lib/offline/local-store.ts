import {
  clear,
  createStore,
  del,
  entries,
  get,
  set,
  type UseStore,
} from 'idb-keyval';

export interface LocalStore<T> {
  get: (key: string) => Promise<T | undefined>;
  set: (key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
  entries: () => Promise<[string, T][]>;
  clear: () => Promise<void>;
}

const DATABASE_PREFIX = 'bathelec';

export const createLocalStore = <T>(name: string): LocalStore<T> => {
  let database: UseStore | undefined;
  const store = () => {
    database ??= createStore(`${DATABASE_PREFIX}-${name}`, name);
    return database;
  };

  return {
    get: (key) => get<T>(key, store()),
    set: (key, value) => set(key, value, store()),
    delete: (key) => del(key, store()),
    entries: () => entries<string, T>(store()),
    clear: () => clear(store()),
  };
};
