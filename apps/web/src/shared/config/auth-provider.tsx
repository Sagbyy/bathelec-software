'use client';

import { useEffect } from 'react';
import { setAuthToken } from '@/shared/api/auth-token';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    fetch('/api/auth/token')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.accessToken) setAuthToken(data.accessToken);
      });
  }, []);

  return <>{children}</>;
}
