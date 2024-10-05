'use client';

import useAuth from '@/hooks/useAuth';
import { useUserStore } from '@/hooks/useUserStore';

export default function Protected() {
  const { logout } = useAuth();
  const { user } = useUserStore();

  return (
    <>
      <p>Welcome {user?.firstName}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
