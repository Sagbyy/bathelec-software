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

const mockPost = vi.hoisted(() => vi.fn());
vi.mock('@/services/api-client', () => ({
  default: { post: mockPost },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('calls POST /auth/login with credentials', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('adminuser', 'Pass123!');
      });

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        username: 'adminuser',
        password: 'Pass123!',
      });
    });

    it('redirects to /dashboard on success', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('adminuser', 'Pass123!');
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(result.current.error).toBe(false);
    });

    it('sets error state and does not redirect on failure', async () => {
      mockPost.mockRejectedValueOnce(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('adminuser', 'wrongpassword');
      });

      expect(result.current.error).toBe(true);
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });

    it('sets loading to true during login', async () => {
      let resolvePost: (value: unknown) => void;
      mockPost.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePost = resolve;
        })
      );

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.login('adminuser', 'Pass123!');
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolvePost!({ data: {} });
      });
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
    });

    it('clears React Query cache on logout', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockClear).toHaveBeenCalledOnce();
    });

    it('redirects to /auth on logout', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockPush).toHaveBeenCalledWith('/auth');
    });
  });
});
