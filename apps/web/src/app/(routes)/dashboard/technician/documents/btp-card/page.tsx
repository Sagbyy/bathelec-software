'use client';

import { OfficialDocumentsForm } from '@/features/official-documents';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function BtpCardPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        eyebrow="Mes documents officiels"
        title="Carte Pro du BTP"
        description="Ajoutez votre carte et sa date de validité."
      />
      <OfficialDocumentsForm documentKeys={['btpCard']} />
    </PageContainer>
  );
}
