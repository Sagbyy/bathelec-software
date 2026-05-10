'use client';

import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { User } from '@repo/types';
import { useUserStore } from '@/hooks/useUserStore';
import { Navbar } from '@/components/protected/navbar';
import { usePathname, useRouter } from 'next/navigation';
import apiClient from '@/services/apiClient';

const fetchUserData = async (): Promise<User> => {
  const response = await apiClient.get('/users/informations');
  return response.data;
};

export default function LayoutProtected({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const { setUser } = useUserStore();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryFn: fetchUserData,
    queryKey: ['user'],
    enabled: isClient,
  });

  useEffect(() => {
    if (user && isClient && pathname) {
      setUser(user);
      // Redirect the user by role
      if (
        user.role === 'admin' &&
        pathname.startsWith('/dashboard/technician')
      ) {
        router.push('/dashboard/admin/derivations/new');
      } else if (
        user.role === 'technician' &&
        pathname.startsWith('/dashboard/admin')
      ) {
        router.push('/dashboard/technician/derivations/complete');
      }
    }
  }, [user, router, isClient, pathname, setUser]);

  if (!isClient) {
    return null;
  }

  if (error) {
    return <p>Error</p>;
  }

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
