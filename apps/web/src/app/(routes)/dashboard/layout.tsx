'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/components/protected/navbar';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useUserStore } from '@/entities/user';

export default function LayoutProtected({ children }: { children: ReactNode }) {
  const { isLoading, isClient, error } = useAuthGuard();
  const { user } = useUserStore();

  if (!isClient) return null;
  if (error) return <p>Error</p>;

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {user?.role === 'admin' && <Navbar />}
      {children}
    </>
  );
}
