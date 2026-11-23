'use client';

import Image from 'next/image';
import { useFinishedChantiers } from '@/entities/chantier';
import { MarketGrid } from '@/features/chantiers';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';

export default function ChantiersTerminesPage() {
  const { data: chantiers, isLoading, error } = useFinishedChantiers();

  return (
    <PageContainer width="default">
      <PageHeader
        icon={
          <Image
            src="/images/green-folder.png"
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
        }
        title="Chantiers terminés"
        description="Historique de vos chantiers terminés"
      />
      {isLoading ? (
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
          aria-label="Chargement..."
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Une erreur est survenue"
          description="Impossible de charger les chantiers. Réessayez plus tard."
        />
      ) : (
        <MarketGrid
          chantiers={chantiers ?? []}
          basePath="/dashboard/technician/derivations/complete"
          emptyMessage="Aucun marché avec chantier terminé."
          folderImageSrc="/images/green-folder.png"
        />
      )}
    </PageContainer>
  );
}
