'use client';

import { VehicleDocumentsForm } from '@/features/vehicle-documents';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function DrivingLicensePage() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        eyebrow="Mon véhicule"
        title="Mon permis de conduire"
        description="Ajoutez votre permis et sa date de validité."
      />
      <VehicleDocumentsForm documentKeys={['drivingLicense']} />
    </PageContainer>
  );
}
