import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Role, type User } from '@repo/types';
import { useAuthGuard } from './use-auth-guard';

const getCurrentUser = vi.hoisted(() => vi.fn());
const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/dashboard/technician',
}));

vi.mock('@/entities/user', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  userService: { getCurrentUser },
}));

const technician = { id: 3, role: Role.TECHNICIAN } as User;

const renderGuard = (queryClient: QueryClient) =>
  renderHook(() => useAuthGuard(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

describe('useAuthGuard', () => {
  it('reports an error when the session cannot be loaded', async () => {
    getCurrentUser.mockRejectedValue(new Error('Network Error'));
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderGuard(queryClient);

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });

  it('keeps the cached technician usable when the network fails (ENF-08)', async () => {
    getCurrentUser.mockRejectedValue(new Error('Network Error'));
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 0 } },
    });
    queryClient.setQueryData(['user'], technician, { updatedAt: 0 });

    const { result } = renderGuard(queryClient);

    await waitFor(() => expect(getCurrentUser).toHaveBeenCalled());
    await waitFor(() =>
      expect(queryClient.getQueryState(['user'])?.status).toBe('error')
    );
    expect(result.current.user).toEqual(technician);
    expect(result.current.error).toBeNull();
  });
});
