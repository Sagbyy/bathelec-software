'use client';

import { useState } from 'react';
import {
  AffaireStats,
  summarizeByInternalAffaire,
} from '@/entities/derivation';
import { useDerivation } from '@/features/derivations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

export function AffaireStatsTable() {
  const { data: derivations, isLoading } = useDerivation();
  const [search, setSearch] = useState('');

  const query = search.trim().toUpperCase();
  const rows = summarizeByInternalAffaire(derivations ?? []).filter(
    (stats) =>
      stats.internalAffaireNumber.includes(query) ||
      stats.address.toUpperCase().includes(query)
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Suivi par n° d'affaire interne</CardTitle>
          <CardDescription>
            Avancement des dérivations regroupées par affaire
          </CardDescription>
        </div>
        <Input
          placeholder="Rechercher une affaire..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full sm:w-64"
        />
      </CardHeader>
      <CardContent>
        <AffaireStatsContent isLoading={isLoading} rows={rows} />
      </CardContent>
    </Card>
  );
}

function AffaireStatsContent({
  isLoading,
  rows,
}: {
  isLoading: boolean;
  rows: AffaireStats[];
}) {
  if (isLoading) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        Chargement des statistiques...
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        Aucune affaire à afficher.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° d'affaire</TableHead>
          <TableHead className="hidden md:table-cell">Chantier</TableHead>
          <TableHead className="text-right">Dérivations</TableHead>
          <TableHead className="text-right">Terminées</TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            À valider
          </TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            À corriger
          </TableHead>
          <TableHead className="text-right">Avancement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((stats) => (
          <TableRow key={stats.internalAffaireNumber}>
            <TableCell className="font-medium">
              {stats.internalAffaireNumber}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {stats.address}
            </TableCell>
            <TableCell className="text-right">{stats.total}</TableCell>
            <TableCell className="text-right">{stats.completed}</TableCell>
            <TableCell className="hidden text-right sm:table-cell">
              {stats.awaitingReview}
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell">
              {stats.awaitingCorrection}
            </TableCell>
            <TableCell className="text-right">
              {stats.completionRate} %
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
