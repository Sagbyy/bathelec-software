import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { Query, QueryKey } from '@tanstack/react-query';
import { Role } from '@repo/types';
import { createLocalStore } from './local-store';
import { clearServiceWorkerCaches } from './service-worker';

export const READ_CACHE_KEY = 'technician-read-cache';
export const READ_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const FIELD_ROLES: ReadonlySet<string> = new Set([
  Role.TECHNICIAN,
  Role.SITE_MANAGER,
]);

const PERSISTED_QUERY_ROOTS: ReadonlySet<unknown> = new Set([
  'user',
  'derivations',
  'derivation',
  'completed-derivations',
  'chantiers',
  'markets',
  'site-teams',
]);

const readCacheStore = createLocalStore<string>('read-cache');

export const isFieldRole = (role: string | undefined) =>
  role !== undefined && FIELD_ROLES.has(role);

export const shouldPersistQuery = (
  queryKey: QueryKey,
  role: string | undefined
) => isFieldRole(role) && PERSISTED_QUERY_ROOTS.has(queryKey[0]);

export const shouldPersistSuccessfulQuery = (
  query: Pick<Query, 'queryKey' | 'state'>,
  role: string | undefined
) =>
  query.state.status === 'success' && shouldPersistQuery(query.queryKey, role);

export const readCachePersister = createAsyncStoragePersister({
  key: READ_CACHE_KEY,
  storage:
    typeof window === 'undefined'
      ? undefined
      : {
          getItem: async (key) => (await readCacheStore.get(key)) ?? null,
          setItem: (key, value) => readCacheStore.set(key, value),
          removeItem: (key) => readCacheStore.delete(key),
        },
});

export const clearOfflineReadCache = async () => {
  await Promise.allSettled([
    readCacheStore.clear(),
    clearServiceWorkerCaches(),
  ]);
};
