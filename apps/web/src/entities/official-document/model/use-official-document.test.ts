import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { server } from '@/test/msw/server';
import {
  useOfficialDocument,
  useUpsertOfficialDocument,
  OFFICIAL_DOCUMENT_QUERY_KEY,
} from './use-official-document';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useOfficialDocument', () => {
  afterEach(() => server.resetHandlers());

  it('retourne les documents pour un userId valide', async () => {
    const { result } = renderHook(() => useOfficialDocument(1), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      userId: 1,
      idCard: 'data:image/jpeg;base64,pieceBase64',
      btpCard: 'data:image/jpeg;base64,btpBase64',
      mutualCard: 'data:image/jpeg;base64,mutuelleBase64',
    });
  });

  it("n'exécute pas la requête si userId est 0 (falsy)", () => {
    const { result } = renderHook(() => useOfficialDocument(0), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('passe en erreur si le serveur répond 404', async () => {
    server.use(
      http.get(`${BASE}/official-documents/by-user/:userId`, () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 })
      )
    );

    const { result } = renderHook(() => useOfficialDocument(99), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpsertOfficialDocument', () => {
  afterEach(() => server.resetHandlers());

  it('appelle le service createOrUpdate et retourne le document', async () => {
    const { result } = renderHook(() => useUpsertOfficialDocument(1), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        idCard: 'data:image/jpeg;base64,nouvellePiece',
        btpCard: null,
        mutualCard: null,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      idCard: 'data:image/jpeg;base64,nouvellePiece',
    });
  });

  it('passe en erreur si le serveur répond 400', async () => {
    server.use(
      http.post(`${BASE}/official-documents`, () =>
        HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
      )
    );

    const { result } = renderHook(() => useUpsertOfficialDocument(1), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({ idCard: 'invalid' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('invalide la query official-document après un succès', async () => {
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

    const { result } = renderHook(() => useUpsertOfficialDocument(1), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ idCard: 'data:image/jpeg;base64,test' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [OFFICIAL_DOCUMENT_QUERY_KEY, 1],
    });
  });
});
