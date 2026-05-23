import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { server } from '@/test/msw/server';
import {
  useVehicleDocument,
  useUpsertVehicleDocument,
  VEHICLE_DOCUMENT_QUERY_KEY,
} from './use-vehicle-document';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useVehicleDocument', () => {
  afterEach(() => server.resetHandlers());

  it('retourne le document pour un userId valide', async () => {
    const { result } = renderHook(() => useVehicleDocument(1), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      userId: 1,
      vehicleRegistration: 'data:image/jpeg;base64,vehicleRegistrationBase64',
    });
  });

  it("n'exécute pas la requête si userId est 0 (falsy)", () => {
    const { result } = renderHook(() => useVehicleDocument(0), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('passe en erreur si le serveur répond 404', async () => {
    server.use(
      http.get(`${BASE}/vehicle-documents/by-user/:userId`, () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 })
      )
    );

    const { result } = renderHook(() => useVehicleDocument(99), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpsertVehicleDocument', () => {
  afterEach(() => server.resetHandlers());

  it('appelle le service createOrUpdate et retourne le document', async () => {
    const { result } = renderHook(() => useUpsertVehicleDocument(1), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        vehicleRegistration: 'data:image/jpeg;base64,nouveau',
        drivingLicense: null,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      vehicleRegistration: 'data:image/jpeg;base64,nouveau',
    });
  });

  it('passe en erreur si le serveur répond 400', async () => {
    server.use(
      http.post(`${BASE}/vehicle-documents`, () =>
        HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
      )
    );

    const { result } = renderHook(() => useUpsertVehicleDocument(1), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({ vehicleRegistration: 'invalid' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('invalide la query vehicle-document après un succès', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useUpsertVehicleDocument(1), { wrapper });

    await act(async () => {
      result.current.mutate({ vehicleRegistration: 'data:image/jpeg;base64,test' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [VEHICLE_DOCUMENT_QUERY_KEY, 1],
    });
  });
});
