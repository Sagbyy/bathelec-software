'use client';

import { HTMLAttributes, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DerivationStatus } from '@repo/types';
import { useDerivation } from '@/features/derivations';
import { derivationStatusConfig } from '@/entities/derivation';
import { cn } from '@/shared/lib/utils';
import { StatCard } from '@/shared/ui/stat-card';

interface FormStatusCardsProps extends HTMLAttributes<HTMLDivElement> {}

export function FormStatusCards({ className, ...props }: FormStatusCardsProps) {
  const { data: derivations } = useDerivation();

  const statusCounts = useMemo(
    () =>
      (derivations ?? []).reduce<Partial<Record<DerivationStatus, number>>>(
        (acc, { status }) => ({ ...acc, [status]: (acc[status] ?? 0) + 1 }),
        {}
      ),
    [derivations]
  );

  return (
    <div
      className={cn('grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3', className)}
      {...props}
    >
      {Object.values(DerivationStatus).map((status) => {
        const { icon, text, tone } = derivationStatusConfig[status];
        return (
          <StatCard
            key={status}
            label={text}
            value={statusCounts[status] ?? 0}
            hint={`Dérivations ${text.toLowerCase()}`}
            tone={tone}
            icon={<Icon icon={icon} />}
          />
        );
      })}
    </div>
  );
}
