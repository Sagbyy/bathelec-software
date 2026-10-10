'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@repo/types';
import { useUserStore } from '@/entities/user/model/use-user-store';
import { PageLoader } from '@/shared/ui/page-loader';
import TechnicianPage from './technician-page';
import AdminPage from './admin-page';

export default function DashboardPage() {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === Role.SUPERVISOR) {
      router.replace('/dashboard/admin/users');
    }
  }, [user, router]);

  if (user?.role === Role.ADMIN) {
    return <AdminPage />;
  }

  if (user?.role === Role.TECHNICIAN) {
    return <TechnicianPage />;
  }

  if (user?.role === Role.SUPERVISOR) {
    return <PageLoader />;
  }

  return null;
}
