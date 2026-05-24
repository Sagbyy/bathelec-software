'use client';

import { Button } from '@/shared/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Chantier } from '@repo/types';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { ChantierStatusBadge } from './chantier-status-badge';

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

export function buildChantierColumns(basePath: string): ColumnDef<Chantier>[] {
  return [
    {
      id: 'folder',
      header: '',
      cell: () => (
        <Icon icon="mdi:folder" className="h-6 w-6 text-gray-400" />
      ),
    },
    {
      accessorKey: 'address',
      header: ({ column }) => <SortableHeader column={column} label="Adresse" />,
    },
    {
      accessorFn: (row) => row.market?.name ?? '—',
      id: 'market',
      header: ({ column }) => <SortableHeader column={column} label="Marché" />,
    },
    {
      accessorKey: 'enedisAffaireNumber',
      header: ({ column }) => (
        <SortableHeader column={column} label="N° Enedis" />
      ),
    },
    {
      accessorKey: 'internalAffaireNumber',
      header: ({ column }) => (
        <SortableHeader column={column} label="N° Interne" />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} label="Statut" />,
      cell: ({ row }) => <ChantierStatusBadge chantier={row.original} />,
    },
    {
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Link
          href={`${basePath}/markets/${row.original.marketId}/chantiers/${row.original.id}`}
        >
          <Button variant="outline">Voir</Button>
        </Link>
      ),
    },
  ];
}
