'use client';

import { UserPlus } from 'lucide-react';
import RegisterTechnicianForm from '@/features/users/ui/register-technician-form';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function CreateTechnician() {
  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<UserPlus />}
        title="Créer un compte de technicien"
        description="Entrer les informations du technicien"
      />
      <div className="bg-card shadow-card rounded-xl border p-4 sm:p-6">
        <RegisterTechnicianForm />
      </div>
    </PageContainer>
  );
}
