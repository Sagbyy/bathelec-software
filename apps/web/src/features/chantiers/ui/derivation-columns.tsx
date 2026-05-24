'use client';

import { Button } from '@/shared/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DerivationStatus } from '@repo/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import DerivationStatusIcon from '@/entities/derivation/ui/derivation-status-icon';
import { DerivationRow } from '../lib/derivation-row';

function getStatusAction(status: DerivationStatus) {
  switch (status) {
    case DerivationStatus.PENDING:
      return (
        <Button
          variant="outline"
          className="bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
        >
          Compléter
        </Button>
      );
    case DerivationStatus.REVISING:
      return (
        <Button
          variant="outline"
          className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
        >
          Corriger
        </Button>
      );
    case DerivationStatus.ONGOING:
      return (
        <Button
          variant="outline"
          className="bg-slate-500 text-white hover:bg-slate-600 hover:text-white"
        >
          Continuer
        </Button>
      );
    default:
      return <Button variant="outline">Voir</Button>;
  }
}

function SortableHeader({
  column,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: any;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      {column.getIsSorted() === 'desc' ? (
        <Icon icon="ri:arrow-down-line" className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === 'asc' ? (
        <Icon icon="ri:arrow-up-line" className="ml-2 h-4 w-4" />
      ) : (
        <Icon icon="ri:arrow-up-down-line" className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

function getCmHighlight(cm: string): string {
  const value = cm.trim().toUpperCase();
  if (value.startsWith('2D')) return 'bg-green-100 text-green-800';
  if (value.startsWith('1D')) return 'bg-yellow-100 text-yellow-800';
  return '';
}

const placeholder = (value: string) => value || '—';

export const derivationColumns: ColumnDef<DerivationRow>[] = [
  {
    accessorKey: 'building',
    header: ({ column }) => (
      <SortableHeader column={column} label="Bâtiment" />
    ),
    cell: ({ row }) => placeholder(row.original.building),
  },
  {
    accessorKey: 'cmIdentification',
    header: ({ column }) => <SortableHeader column={column} label="CM" />,
    cell: ({ row }) => {
      const cm = row.original.cmIdentification;
      if (!cm) return '—';
      return (
        <span
          className={cn(
            'inline-block rounded px-2 py-1 text-sm font-medium',
            getCmHighlight(cm)
          )}
        >
          {cm}
        </span>
      );
    },
  },
  {
    accessorKey: 'folio',
    header: ({ column }) => <SortableHeader column={column} label="Folio" />,
    cell: ({ row }) => placeholder(row.original.folio),
  },
  {
    accessorKey: 'floor',
    header: ({ column }) => <SortableHeader column={column} label="Étage" />,
    cell: ({ row }) => placeholder(row.original.floor),
  },
  {
    accessorKey: 'electricianName',
    header: ({ column }) => (
      <SortableHeader column={column} label="Électricien" />
    ),
    cell: ({ row }) => placeholder(row.original.electricianName),
  },
  {
    accessorKey: 'clientName',
    header: ({ column }) => <SortableHeader column={column} label="Client" />,
    cell: ({ row }) => placeholder(row.original.clientName),
  },
  {
    accessorKey: 'completedAt',
    header: ({ column }) => (
      <SortableHeader column={column} label="Terminée le" />
    ),
    cell: ({ row }) => {
      const date = row.original.completedAt;
      if (!date) return '—';
      return format(date, 'dd MMM yyyy');
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableHeader column={column} label="Statut" />,
    cell: ({ row }) => (
      <DerivationStatusIcon derivationStatus={row.original.status} />
    ),
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <Link
        href={`/dashboard/technician/derivations/complete/${row.original.id}`}
      >
        {getStatusAction(row.original.status)}
      </Link>
    ),
  },
];
