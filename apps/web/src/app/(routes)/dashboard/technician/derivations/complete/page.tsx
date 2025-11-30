'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDerivationByUser } from '@/hooks/queries/use-derivation';
import { useUserStore } from '@/hooks/useUserStore';
import { DerivationStatus } from '@repo/types';
import DerivationStatusIcon from '@/components/shared/derivation-status-icon';
import { formatDate } from 'date-fns';

function getStatusAction(status: DerivationStatus) {
  switch (status) {
    case DerivationStatus.PENDING:
      return 'Compléter';
    case DerivationStatus.REVIEWING:
      return 'Voir';
    case DerivationStatus.INCORRECT:
      return 'Corriger';
    case DerivationStatus.COMPLETED:
      return 'Voir';
  }
}

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Code postal</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {completeToDerivations?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>Aucun relevé de dérivation</TableCell>
            </TableRow>
          ) : (
            completeToDerivations?.map((derivation) => (
              <TableRow key={derivation.id}>
                <TableCell>{derivation.id}</TableCell>
                <TableCell>{formatDate(derivation.createdAt, 'dd/MM/yyyy')}</TableCell>
                <TableCell>{derivation.address}</TableCell>
                <TableCell>{derivation.city}</TableCell>
                <TableCell>{derivation.postalCode}</TableCell>
                <TableCell>
                  <DerivationStatusIcon derivationStatus={derivation.status} />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/technician/derivations/complete/${derivation.id}`}
                  >
                    <Button variant="outline">
                      {getStatusAction(derivation.status)}
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
