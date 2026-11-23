'use client';

import { FilePlus2 } from 'lucide-react';
import { CreateDerivationForm } from '@/features/derivations';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function CreateDerivationPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<FilePlus2 />}
        title="Créer un relevé de dérivation"
        description="Entrer les informations du relevé de dérivation"
      />
      <div className="bg-card shadow-card rounded-xl border p-4 sm:p-6">
        <CreateDerivationForm />
      </div>
    </PageContainer>
  );
}
