'use client';

import { Briefcase } from 'lucide-react';
import { CreateMarketForm } from '@/features/chantiers';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function CreateMarketPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<Briefcase />}
        title="Créer un marché"
        description="Ajouter un marché pour y rattacher des chantiers"
      />
      <div className="bg-card shadow-card rounded-xl border p-4 sm:p-6">
        <CreateMarketForm />
      </div>
    </PageContainer>
  );
}
