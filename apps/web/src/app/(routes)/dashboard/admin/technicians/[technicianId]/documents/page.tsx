'use client';

import { FileText } from 'lucide-react';
import { useUserById } from '@/features/users';
import { TechnicianDocumentsView } from '@/widgets/technician-documents';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

interface PageProps {
  params: { technicianId: string };
}

export default function AdminTechnicianDocumentsPage({ params }: PageProps) {
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
        icon={<FileText />}
        title="Documents du technicien"
        description={
          technician
            ? `${technician.firstName} ${technician.lastName} (${technician.username}) — consultation seule`
            : `Technicien #${userId} — consultation seule`
        }
      />
      <TechnicianDocumentsView technicianId={userId} />
    </PageContainer>
  );
}
