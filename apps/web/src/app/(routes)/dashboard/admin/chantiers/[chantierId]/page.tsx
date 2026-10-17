'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useChantiers } from '@/entities/chantier';
import { ChantierDocumentsManager } from '@/widgets/chantier-documents';
import { ExportEnedisButton } from '@/features/enedis-export';

export default function AdminChantierDetailPage() {
  const { chantierId } = useParams();
  const chantierIdNumber = parseInt(chantierId as string);
  const { data: chantiers, isLoading, error } = useChantiers();
  const chantier = chantiers?.find((item) => item.id === chantierIdNumber);

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Une erreur est survenue</p>
      </div>
    );
  }

  if (!chantier) {
    return (
      <div className="p-8">
        <p>Chantier introuvable.</p>
      </div>
    );
  }

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <Link
        href="/dashboard/admin/chantiers"
        className="text-muted-foreground mb-4 inline-block text-sm"
      >
        ← Retour aux chantiers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{chantier.address}</h1>
        <ExportEnedisButton
          scope="chantiers"
          id={chantier.id}
          label="Exporter le chantier (Excel Enedis)"
        />
      </div>

      <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-sm">
        <span>Marché : {chantier.market?.name ?? '—'}</span>
        <span>N° ENEDIS : {chantier.enedisAffaireNumber}</span>
        <span>N° interne : {chantier.internalAffaireNumber}</span>
      </div>

      <ChantierDocumentsManager chantierId={chantierIdNumber} />
    </div>
  );
}
