'use client';

import { OfficialDocumentsForm } from '@/features/official-documents';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function IdCardPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        eyebrow="Mes documents officiels"
        title="Pièce d'identité ou titre de séjour"
        description="Ajoutez votre document et sa date de validité."
      />
      <OfficialDocumentsForm documentKeys={['idCard']} />
    </PageContainer>
  );
}
