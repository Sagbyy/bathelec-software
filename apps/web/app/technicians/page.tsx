'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface TechniciansProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function Technicians({
  children,
  allowedRoles,
}: TechniciansProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      (!user || (allowedRoles && !allowedRoles.includes(user.role)))
    ) {
      router.push('/auth'); // Redirige vers la page de connexion
    }
  }, [user, allowedRoles, loading, router]);

  return !loading && user ? (
    <>
      <p>Technicians</p>
      <p>{user.sub}</p>
      <p>{user.username}</p>
      <p>{user.role}</p>
      {children}
    </>
  ) : null; // Affiche les enfants si l'utilisateur est authentifié
}
