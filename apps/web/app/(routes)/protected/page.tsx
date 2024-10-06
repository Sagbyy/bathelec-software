'use client';

import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useUserStore } from '@/hooks/useUserStore';

export default function Protected() {
  const { logout } = useAuth();
  const { user } = useUserStore();

  return (
    <>
      <p>
        Welcome {user?.firstName} {user?.lastName}
      </p>
      <Button onClick={logout}>Se déconnecter</Button>
    </>
  );
}
