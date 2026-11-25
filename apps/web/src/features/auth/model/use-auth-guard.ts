'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@repo/types';
import { userService, useUserStore } from '@/entities/user';
import { HOME_PATH, isRoleAllowedForPath } from '@/shared/config';

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

    if (!isRoleAllowedForPath(user.role, pathname)) {
      router.push(HOME_PATH);
    }
  }, [user, router, isClient, pathname, setUser]);

  return { user, isLoading, isClient, error };
}
