'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/components/protected/navbar';
import { useAuthGuard } from '@/hooks/use-auth-guard';

export default function LayoutProtected({ children }: { children: ReactNode }) {
  const { isLoading, isClient, error } = useAuthGuard();

  if (!isClient) return null;
  if (error) return <p>Error</p>;

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Navbar />
          {children}
        </>
      )}
    </>
  );
}
