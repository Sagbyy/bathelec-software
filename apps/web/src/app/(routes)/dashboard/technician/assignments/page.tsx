'use client';

import { HardHat } from 'lucide-react';
import { TeamDerivationsList } from '@/features/derivations';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function TechnicianAssignmentsPage() {
  return (
    <PageContainer width="default">
      <PageHeader
        icon={<HardHat />}
        title="Mes dérivations"
        description="Les relevés de dérivation de votre équipe"
      />
      <TeamDerivationsList />
    </PageContainer>
  );
}
