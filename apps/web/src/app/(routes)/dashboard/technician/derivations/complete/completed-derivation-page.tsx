'use client';

import { useDerivationByUser } from '@/hooks/queries/use-derivation';
import { useUserStore } from '@/hooks/use-user-store';
import { DataTable } from './data-table';
import { columns } from './columns';

export default function CompleteDerivationPage() {
  const { user } = useUserStore();
  const {
    data: completeToDerivations,
    isLoading,
    error,
  } = useDerivationByUser(user?.id ?? -1);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Une erreur est survenue</div>;
  }

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <h1 className="mb-5 text-2xl font-bold">
        Liste des relevés de dérivation
      </h1>
      <DataTable columns={columns} data={completeToDerivations ?? []} />
      <p className="text-muted-foreground mt-4 text-sm">
        <span className="font-bold">{completeToDerivations?.length ?? 0}</span>{' '}
        relevés de dérivation trouvés
      </p>
    </div>
  );
}
