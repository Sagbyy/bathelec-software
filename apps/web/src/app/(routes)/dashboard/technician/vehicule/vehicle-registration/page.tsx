'use client';

import { VehicleDocumentsForm } from '@/features/vehicle-documents';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function VehicleRegistrationPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        eyebrow="Mon véhicule"
        title="Carte grise de mon véhicule"
        description="Ajoutez la carte grise et sa date de validité."
      />
      <VehicleDocumentsForm documentKeys={['vehicleRegistration']} />
    </PageContainer>
  );
}
