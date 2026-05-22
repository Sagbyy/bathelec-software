import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuth from './use-auth';

const mockPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockClear = vi.hoisted(() => vi.fn());
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ clear: mockClear }),
}));

const mockFetch = vi.fn();

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', mockFetch);
  });

  describe('login', () => {
    it('calls POST /api/auth/login with credentials', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('adminuser', 'Pass123!');
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'adminuser', password: 'Pass123!' }),
      });
    });

    it('redirects to /dashboard on success', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('adminuser', 'Pass123!');
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(result.current.error).toBe(false);
    });

    it('sets error state and does not redirect on failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('adminuser', 'wrongpassword');
      });

      expect(result.current.error).toBe(true);
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });

    it('sets loading to true during login', async () => {
      let resolveFetch: (value: unknown) => void;
      mockFetch.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
      );

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.login('adminuser', 'Pass123!');
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolveFetch!({ ok: true, json: () => Promise.resolve({}) });
      });
    });
  });

  describe('logout', () => {
    it('calls POST /api/auth/logout', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
    });

    it('clears React Query cache on logout', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockClear).toHaveBeenCalledOnce();
    });

    it('redirects to /auth on logout', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockPush).toHaveBeenCalledWith('/auth');
    });
  });
});
