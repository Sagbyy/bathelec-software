'use client';

import Image from 'next/image';
import { useOngoingChantiers } from '@/entities/chantier';
import { MarketGrid } from '@/features/chantiers';

export default function ChantiersEnCoursPage() {
  const { data: chantiers, isLoading, error } = useOngoingChantiers();

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8">Une erreur est survenue</div>;

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <div className="mb-6 flex items-center gap-3">
        <Image
          src="/images/red-folder.png"
          alt=""
          width={40}
          height={40}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold">Chantiers en cours</h1>
      </div>
      <MarketGrid
        chantiers={chantiers ?? []}
        basePath="/dashboard/technician/derivations"
        emptyMessage="Aucun marché avec chantier en cours."
        folderImageSrc="/images/red-folder.png"
      />
    </div>
  );
}
