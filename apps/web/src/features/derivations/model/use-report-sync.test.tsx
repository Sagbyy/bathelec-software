import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { toast } from 'sonner';
import { DerivationStatus } from '@repo/types';
import { server } from '@/test/msw/server';
import { setAuthToken } from '@/shared/api';
import type { CreateCompletedDerivation } from '@/entities/derivation';
import { reportOutbox } from './report-offline-store';
import {
  rejectedReportMessage,
  syncedReportsMessage,
  useReportSync,
} from './use-report-sync';
import { getOfflineReportPaths } from './use-offline-page-warmup';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const OWNER_ID = 9;
const payload = {} as CreateCompletedDerivation;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe('useReportSync (ENF-08)', () => {
  beforeEach(async () => {
    setAuthToken('token');
    await reportOutbox.remove(OWNER_ID, 1);
    await reportOutbox.remove(OWNER_ID, 2);
  });

  afterEach(() => {
    setAuthToken(null);
    vi.clearAllMocks();
  });

  it('sends the queued reports when the app starts and confirms it', async () => {
    server.use(
      http.post(`${BASE}/completed-derivations/`, () =>
        HttpResponse.json({}, { status: 201 })
      )
    );
    await reportOutbox.enqueue({ ownerId: OWNER_ID, targetId: 1, payload });

    const { unmount } = renderHook(() => useReportSync(OWNER_ID), { wrapper });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(syncedReportsMessage(1))
    );
    expect(await reportOutbox.list(OWNER_ID)).toEqual([]);
    unmount();
  });

  it('surfaces a server rejection instead of retrying it forever', async () => {
    server.use(
      http.post(`${BASE}/completed-derivations/`, () =>
        HttpResponse.json(
          { message: 'This derivation report can no longer be modified' },
          { status: 409 }
        )
      )
    );
    await reportOutbox.enqueue({ ownerId: OWNER_ID, targetId: 2, payload });

    const { unmount } = renderHook(() => useReportSync(OWNER_ID), { wrapper });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        rejectedReportMessage(
          2,
          'This derivation report can no longer be modified'
        )
      )
    );
    expect(await reportOutbox.find(OWNER_ID, 2)).toMatchObject({
      status: 'rejected',
    });
    unmount();
  });

  it('does nothing until the technician is known', () => {
    renderHook(() => useReportSync(undefined), { wrapper });
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe('getOfflineReportPaths', () => {
  it('keeps only the reports the technician can still fill', () => {
    expect(
      getOfflineReportPaths([
        { id: 1, status: DerivationStatus.PENDING },
        { id: 2, status: DerivationStatus.REVIEWING },
        { id: 3, status: DerivationStatus.REVISING },
        { id: 4, status: DerivationStatus.COMPLETED },
      ])
    ).toEqual([
      '/dashboard/technician/derivations/complete/1',
      '/dashboard/technician/derivations/complete/3',
    ]);
  });
});
