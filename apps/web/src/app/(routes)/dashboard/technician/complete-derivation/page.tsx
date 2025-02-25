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
import { useDerivationByUser } from '@/hooks/services/useDerivation';
import { useUserStore } from '@/hooks/useUserStore';
import { DerivationStatus } from '@repo/types';
import { Icon } from '@iconify/react/dist/iconify.js';

function getStatusAction(status: DerivationStatus) {
  switch (status) {
    case DerivationStatus.PENDING:
      return 'Compléter';
    case DerivationStatus.INCORRECT:
      return 'Corriger';
    case DerivationStatus.COMPLETED:
      return 'Afficher';
  }
}

function getStatusColor(status: DerivationStatus) {
  switch (status) {
    case DerivationStatus.PENDING:
      return (
        <div className="flex items-center gap-2 text-yellow-500">
          <Icon icon="mdi:clock-outline" />
          <span className="font-semibold">En cours</span>
        </div>
      );
    case DerivationStatus.INCORRECT:
      return (
        <div className="flex items-center gap-2 text-red-500">
          <Icon icon="mdi:close-circle-outline" />
          <span className="font-semibold">Corrigé</span>
        </div>
      );
    case DerivationStatus.COMPLETED:
      return (
        <div className="flex items-center gap-2 text-green-500">
          <Icon icon="mdi:check-circle-outline" />
          <span className="font-semibold">Terminé</span>
        </div>
      );
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
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">
        Liste des relevés de dérivation
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
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
                <TableCell>{derivation.address}</TableCell>
                <TableCell>{derivation.city}</TableCell>
                <TableCell>{derivation.postalCode}</TableCell>
                <TableCell>{getStatusColor(derivation.status)}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/technician/complete-derivation/${derivation.id}`}
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
