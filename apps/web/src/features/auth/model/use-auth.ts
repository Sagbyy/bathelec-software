'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';

const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const login = async (username: string, password: string) => {
    setError(false);
    setLoading(true);
    try {
      await apiClient.post('/auth/login', { username, password });
      router.push('/dashboard');
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await apiClient.post('/auth/logout');
    queryClient.clear();
    router.push('/auth');
  };

  return { login, logout, error, loading };
};

export default useAuth;
