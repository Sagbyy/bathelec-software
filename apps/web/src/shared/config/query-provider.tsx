'use client';

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { User } from '@repo/types';
import {
  READ_CACHE_MAX_AGE_MS,
  readCachePersister,
  shouldPersistSuccessfulQuery,
} from '@/shared/lib/offline/read-cache';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: READ_CACHE_MAX_AGE_MS,
      retry: 1,
    },
  },
});

const currentRole = () => queryClient.getQueryData<User>(['user'])?.role;

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: readCachePersister,
        maxAge: READ_CACHE_MAX_AGE_MS,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            shouldPersistSuccessfulQuery(query, currentRole()),
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
