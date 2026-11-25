'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const login = async (username: string, password: string) => {
    setError(false);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error();
      queryClient.clear();
      router.push('/dashboard');
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    queryClient.clear();
    router.push('/auth');
  };

  return { login, logout, error, loading };
};

export default useAuth;
