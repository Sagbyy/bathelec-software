'use client';

import { ReactNode } from 'react';
import { Role } from '@repo/types';
import { Navbar } from '@/widgets/navbar';
import { TechnicianShell } from '@/widgets/technician-shell';
import { useAuthGuard } from '@/features/auth/model/use-auth-guard';
import { useUserStore } from '@/entities/user';
import { PageLoader } from '@/shared/ui/page-loader';
import { EmptyState } from '@/shared/ui/empty-state';

const MANAGEMENT_ROLES: Role[] = [Role.ADMIN, Role.SUPERVISOR];

export default function LayoutProtected({ children }: { children: ReactNode }) {
  const { isLoading, isClient, error } = useAuthGuard();
  const { user } = useUserStore();

  if (!isClient) return null;
  if (error)
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        <EmptyState
          title="Session indisponible"
          description="Impossible de vérifier votre session. Reconnectez-vous pour continuer."
        />
      </div>
    );

  if (isLoading) return <PageLoader />;

  if (user && MANAGEMENT_ROLES.includes(user.role)) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return <TechnicianShell>{children}</TechnicianShell>;
}
