import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { server } from '@/test/msw/server';
import { useDeleteSiteTeam } from './use-site-teams';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

describe('useDeleteSiteTeam', () => {
  afterEach(() => server.resetHandlers());

  it('invalidates the cached detail queries of the deleted team', async () => {
    server.use(
      http.delete(`${BASE}/site-teams/:teamId`, () => HttpResponse.json({}))
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.setQueryData(['site-teams', 4], { id: 4 });
    queryClient.setQueryData(['site-teams', 4, 'with-users'], { id: 4 });
    queryClient.setQueryData(['site-teams', 4, 'users'], []);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useDeleteSiteTeam(), { wrapper });

    await act(async () => {
      result.current.mutate(4);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    for (const key of [
      ['site-teams', 4],
      ['site-teams', 4, 'with-users'],
      ['site-teams', 4, 'users'],
    ]) {
      expect(queryClient.getQueryState(key)?.isInvalidated).toBe(true);
    }
  });
});
