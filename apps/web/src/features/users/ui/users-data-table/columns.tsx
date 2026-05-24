'use client';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type User = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    meta: { label: 'ID' },
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
  {
    accessorKey: 'username',
    meta: { label: "Nom d'utilisateur" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nom d'utilisateur
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
    accessorKey: 'email',
    meta: { label: 'Email' },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
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
    accessorKey: 'firstName',
    meta: { label: 'Prénom' },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Prénom
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
    accessorKey: 'lastName',
    meta: { label: 'Nom' },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nom
          {column.getIsSorted() === 'desc' ? (
            <Icon icon="ri:arrow-down-line" className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <Icon icon="ri:arrow-up-line" className="ml-2 h-4 w-4" />
          ) : (
            <Icon icon="ri:arrow-up-down-line" className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: 'role',
    meta: { label: 'Rôle' },
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role;

      return (
        <Badge variant={role === 'admin' ? 'destructive' : 'secondary'}>
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    meta: { label: 'Date de création' },
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
    accessorKey: 'edit',
    meta: { label: 'Actions' },
    header: 'Actions',
    cell: ({ row }) => (
      <ActionCell userId={row.original.id} role={row.original.role} />
    ),
  },
];

function ActionCell({ userId, role }: { userId: number; role: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(`/dashboard/admin/users/edit/${userId}`)}
        title="Modifier"
      >
        <Icon icon="material-symbols:edit-rounded" />
      </Button>
      {role === 'technician' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(`/dashboard/admin/technicians/${userId}/habilitations`)
          }
          title="Habilitations"
        >
          <ShieldCheck className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
