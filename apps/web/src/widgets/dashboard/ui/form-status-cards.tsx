'use client';

import { HTMLAttributes, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import { DerivationStatus } from '@repo/types';
import { useDerivation } from '@/features/derivations';
import { derivationStatusConfig } from '@/entities/derivation';
import { Icon } from '@iconify/react/dist/iconify.js';

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

  return (
    <div
      className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {Object.values(DerivationStatus).map((status) => {
        const {
          icon,
          textColor: color,
          backgroundColor: bgColor,
        } = derivationStatusConfig[status];
        return (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {derivationStatusConfig[status].text}
              </CardTitle>
              <div className={cn('rounded-full p-2', bgColor)}>
                <Icon icon={icon} className={cn('h-4 w-4', color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusCounts[status] || 0}
              </div>
              <p className="text-muted-foreground text-xs">
                Total des dérivations{' '}
                {derivationStatusConfig[status].text.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
