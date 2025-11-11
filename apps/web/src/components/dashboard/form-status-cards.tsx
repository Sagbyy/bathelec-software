'use client';

import { HTMLAttributes, useEffect, useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DerivationStatus } from '@repo/types';
import { useDerivation } from '@/hooks/queries/use-derivation';

interface FormStatusCardsProps extends HTMLAttributes<HTMLDivElement> {}

export function FormStatusCards({ className, ...props }: FormStatusCardsProps) {
  const { data: derivations } = useDerivation();
  const [statusCounts, setStatusCounts] = useState<
    Record<DerivationStatus, number>
  >({} as Record<DerivationStatus, number>);

  useEffect(() => {
    const statusCounts = derivations?.reduce(
      (acc, derivation) => {
        const status = derivation.status;
        if (!acc[status]) {
          acc[status] = 0;
        }
        acc[status]++;
        return acc;
      },
      {} as Record<DerivationStatus, number>
    );

    setStatusCounts(statusCounts || ({} as Record<DerivationStatus, number>));
  }, [derivations]);

  const statusConfig = {
    [DerivationStatus.PENDING]: {
      icon: ClipboardList,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    [DerivationStatus.ONGOING]: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    [DerivationStatus.REVIEWING]: {
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    [DerivationStatus.REVISING]: {
      icon: RefreshCw,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    [DerivationStatus.INCORRECT]: {
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    [DerivationStatus.COMPLETED]: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
  };

  const statusText = {
    [DerivationStatus.PENDING]: 'À compléter',
    [DerivationStatus.ONGOING]: 'En cours',
    [DerivationStatus.REVIEWING]: 'En attente de validation',
    [DerivationStatus.REVISING]: 'En attente de correction',
    [DerivationStatus.INCORRECT]: 'Incorrect',
    [DerivationStatus.COMPLETED]: 'Terminé',
  };

  return (
    <div
      className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {Object.values(DerivationStatus).map((status) => {
        const { icon: Icon, color, bgColor } = statusConfig[status];
        return (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {statusText[status]}
              </CardTitle>
              <div className={cn('rounded-full p-2', bgColor)}>
                <Icon className={cn('h-4 w-4', color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusCounts[status] || 0}
              </div>
              <p className="text-muted-foreground text-xs">
                {/* TODO: change to french */}
                Total des dérivations {statusText[status].toLowerCase()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
