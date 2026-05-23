'use client';

import { ShieldCheck, Loader2 } from 'lucide-react';
import { useUserById } from '@/features/users';
import { HabilitationsAdmin } from '@/features/habilitations';

interface PageProps {
  params: { technicianId: string };
}

export default function AdminHabilitationsPage({ params }: PageProps) {
  const userId = Number(params.technicianId);

  const { data: technician, isLoading } = useUserById(userId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
          <ShieldCheck className="h-6 w-6 text-indigo-600" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Habilitations</h1>
          <p className="text-muted-foreground text-sm">
            {technician
              ? `${technician.firstName} ${technician.lastName} (${technician.username})`
              : `Technicien #${userId}`}
          </p>
        </div>
      </div>

      <HabilitationsAdmin technicianId={userId} />
    </div>
  );
}
