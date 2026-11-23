import { ShieldOff } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';

export default function DefaultPage() {
  return (
    <PageContainer width="narrow">
      <EmptyState
        icon={<ShieldOff />}
        title="Accès refusé"
        description="Vous n'avez pas accès à cette page."
      />
    </PageContainer>
  );
}
