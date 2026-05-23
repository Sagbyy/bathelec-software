'use client';

import { useUserStore } from '@/entities/user/model/use-user-store';
import TechnicianPage from './technician-page';
import AdminPage from './admin-page';

export default function DashboardPage() {
  const { user } = useUserStore();

  if (user?.role === 'admin') {
    return <AdminPage />;
  }

  if (user?.role === 'technician') {
    return <TechnicianPage />;
  }

  return null;
}
