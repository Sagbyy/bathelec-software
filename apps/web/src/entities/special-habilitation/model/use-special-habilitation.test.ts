import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { server } from '@/test/msw/server';
import {
  useSpecialHabilitation,
  useUpdateSpecialHabilitation,
  SPECIAL_HABILITATION_QUERY_KEY,
} from './use-special-habilitation';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useSpecialHabilitation', () => {
  afterEach(() => server.resetHandlers());

  it('retourne les habilitations pour un userId valide', async () => {
    const { result } = renderHook(() => useSpecialHabilitation(1), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      userId: 1,
      electricalTitle: true,
      electricalTitleDoc: 'data:image/jpeg;base64,elecBase64',
      sstCertificate: true,
    });
  });

  it("n'exécute pas la requête si userId est 0 (falsy)", () => {
    const { result } = renderHook(() => useSpecialHabilitation(0), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('passe en erreur si le serveur répond 404', async () => {
    server.use(
      http.get(`${BASE}/special-habilitations/by-user/:userId`, () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 })
      )
    );

    const { result } = renderHook(() => useSpecialHabilitation(99), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpdateSpecialHabilitation', () => {
  afterEach(() => server.resetHandlers());

  it('appelle le service upsert et retourne le document mis à jour', async () => {
    const { result } = renderHook(() => useUpdateSpecialHabilitation(1), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({ electricalTitle: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({ electricalTitle: true });
  });

  it('passe en erreur si le serveur répond 403', async () => {
    server.use(
      http.put(`${BASE}/special-habilitations/by-user/:userId`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
      )
    );

    const { result } = renderHook(() => useUpdateSpecialHabilitation(1), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({ electricalTitle: true });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('invalide la query special-habilitation après un succès', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    const { result } = renderHook(() => useUpdateSpecialHabilitation(1), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ ss4Title: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [SPECIAL_HABILITATION_QUERY_KEY, 1],
    });
  });
});
