'use client';

import { Button } from '@/shared/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Derivation, DerivationStatus } from '@repo/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/shared/ui/tooltip';
import Link from 'next/link';
import DerivationStatusIcon from '@/entities/derivation/ui/derivation-status-icon';

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

export const columns: ColumnDef<Derivation>[] = [
  {
    accessorFn: (row) => {
      if (row.address && row.postalCode && row.city) {
        return `${row.address}, ${row.postalCode} ${row.city}`.toLowerCase();
      }
      return "Pas d'adresse renseignée.";
    },
    id: 'address',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Adresse
          {column.getIsSorted() === 'desc' ? (
            <Icon icon="ri:arrow-down-line" className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <Icon icon="ri:arrow-up-line" className="ml-2 h-4 w-4" />
          ) : (
            <Icon icon="ri:arrow-up-down-line" className="ml-2 h-4 w-4" />
          )}{' '}
        </Button>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date de création
          {column.getIsSorted() === 'desc' ? (
            <Icon icon="ri:arrow-down-line" className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <Icon icon="ri:arrow-up-line" className="ml-2 h-4 w-4" />
          ) : (
            <Icon icon="ri:arrow-up-down-line" className="ml-2 h-4 w-4" />
          )}{' '}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="cursor-default">
                {format(row.original.createdAt, 'MMM dd, yyyy')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(row.original.createdAt, 'HH:mm')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/technician/derivations/complete/${row.original.id}`}
        >
          {getStatusAction(row.original.status)}
        </Link>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Statut
          {column.getIsSorted() === 'desc' ? (
            <Icon icon="ri:arrow-down-line" className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <Icon icon="ri:arrow-up-line" className="ml-2 h-4 w-4" />
          ) : (
            <Icon icon="ri:arrow-up-down-line" className="ml-2 h-4 w-4" />
          )}{' '}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <DerivationStatusIcon derivationStatus={row.original.status} />;
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          {column.getIsSorted() === 'desc' ? (
            <Icon icon="ri:arrow-down-line" className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <Icon icon="ri:arrow-up-line" className="ml-2 h-4 w-4" />
          ) : (
            <Icon icon="ri:arrow-up-down-line" className="ml-2 h-4 w-4" />
          )}{' '}
        </Button>
      );
    },
  },
];
