'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { Role, User } from '@repo/types';
import { userService, useUserStore } from '@/entities/user';

export function useAuthGuard() {
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
    queryFn: () => userService.getCurrentUser(),
    queryKey: ['user'],
    enabled: isClient,
  });

  useEffect(() => {
    if (!user || !isClient || !pathname) return;

    setUser(user);

    if (
      user.role === Role.ADMIN &&
      pathname.startsWith('/dashboard/technician')
    ) {
      router.push('/dashboard');
    } else if (
      user.role === Role.TECHNICIAN &&
      pathname.startsWith('/dashboard/admin')
    ) {
      router.push('/dashboard');
    }
  }, [user, router, isClient, pathname, setUser]);

  return { user, isLoading, isClient, error };
}
