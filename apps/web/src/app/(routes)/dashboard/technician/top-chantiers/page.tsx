import Image from 'next/image';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { EmptyState } from '@/shared/ui/empty-state';

export default function TopChantiersPage() {
  return (
    <PageContainer width="default">
      <PageHeader title="TOP Chantiers" />
      <EmptyState
        icon={
          <Image
            src="/images/top-chantier.png"
            alt=""
            width={28}
            height={28}
            className="object-contain"
          />
        }
        title="Bientôt disponible"
      />
    </PageContainer>
  );
}
