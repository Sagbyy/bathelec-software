'use client';

import { Role } from '@repo/types';
import { useUserStore } from '@/entities/user/model/use-user-store';
import TechnicianPage from './technician-page';
import AdminPage from './admin-page';

export default function DashboardPage() {
  const { user } = useUserStore();

  if (user?.role === Role.ADMIN) {
    return <AdminPage />;
  }

  if (user?.role === Role.TECHNICIAN) {
    return <TechnicianPage />;
  }

  return null;
}
