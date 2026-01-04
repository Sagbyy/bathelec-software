'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
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
    header: 'Modifier',
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push(`/dashboard/admin/users/edit/${row.original.id}`);
          }}
        >
          <Icon icon="material-symbols:edit-rounded" />
        </Button>
      );
    },
  },
];
