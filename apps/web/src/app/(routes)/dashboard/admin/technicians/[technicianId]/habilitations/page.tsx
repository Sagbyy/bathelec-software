'use client';

import { ShieldCheck } from 'lucide-react';
import { useUserById } from '@/features/users';
import { HabilitationsAdmin } from '@/features/habilitations';
import { SpecialHabilitationsAdmin } from '@/features/special-habilitations';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

interface PageProps {
  params: { technicianId: string };
}

export default function AdminHabilitationsPage({ params }: PageProps) {
  const userId = Number(params.technicianId);

  const { data: technician, isLoading } = useUserById(userId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<ShieldCheck />}
        title="Habilitations"
        description={
          technician
            ? `${technician.firstName} ${technician.lastName} (${technician.username})`
            : `Technicien #${userId}`
        }
      />

      <div className="space-y-8">
        <section>
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
            Titres &amp; certificats
          </h2>
          <SpecialHabilitationsAdmin technicianId={userId} />
        </section>

        <section>
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
            Habilitations NF C 18-510
          </h2>
          <HabilitationsAdmin technicianId={userId} />
        </section>
      </div>
    </PageContainer>
  );
}
