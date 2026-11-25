'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DerivationStatus, type Derivation } from '@repo/types';
import { derivationQueries } from '@/entities/derivation';
import { useNetworkStatus, warmOfflinePages } from '@/shared/lib/offline';

const SUBMITTED_STATUSES: ReadonlySet<DerivationStatus> = new Set([
  DerivationStatus.REVIEWING,
  DerivationStatus.COMPLETED,
]);

export const reportFormPath = (derivationId: number) =>
  `/dashboard/technician/derivations/complete/${derivationId}`;

export const getOfflineReportPaths = (
  derivations: Pick<Derivation, 'id' | 'status'>[]
) =>
  derivations
    .filter((derivation) => !SUBMITTED_STATUSES.has(derivation.status))
    .map((derivation) => reportFormPath(derivation.id));

export const useOfflinePageWarmup = (shellPaths: readonly string[]) => {
  const online = useNetworkStatus();
  const { data: derivations } = useQuery(derivationQueries.mine());

  useEffect(() => {
    if (!online) {
      return;
    }
    warmOfflinePages([
      ...shellPaths,
      ...getOfflineReportPaths(derivations ?? []),
    ]).catch(() => undefined);
  }, [online, shellPaths, derivations]);
};
