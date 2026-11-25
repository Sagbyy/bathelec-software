'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setAuthToken } from '@/shared/api/auth-token';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    fetch('/api/auth/token')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.accessToken) {
          setAuthToken(data.accessToken);
          queryClient.refetchQueries();
        }
      })
      .catch(() => undefined);
  }, [queryClient]);

  return <>{children}</>;
}
