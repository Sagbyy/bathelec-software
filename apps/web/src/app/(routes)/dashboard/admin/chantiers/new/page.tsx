'use client';

import { HardHat } from 'lucide-react';
import { CreateChantierForm } from '@/features/chantiers';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function CreateChantierPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<HardHat />}
        title="Créer un chantier"
        description="Renseigner les informations du chantier et son marché associé"
      />
      <div className="bg-card shadow-card rounded-xl border p-4 sm:p-6">
        <CreateChantierForm />
      </div>
    </PageContainer>
  );
}
