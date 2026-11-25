'use client';

import { useUserStore } from '@/entities/user';
import { useNetworkStatus } from '@/shared/lib/offline';
import { NetworkStatusIndicator } from '@/shared/ui/network-status-indicator';
import { useOfflinePageWarmup } from '../model/use-offline-page-warmup';
import { useQueuedReports, useReportSync } from '../model/use-report-sync';

interface ReportSyncStatusProps {
  shellPaths: readonly string[];
}

export function ReportSyncStatus({
  shellPaths,
}: Readonly<ReportSyncStatusProps>) {
  const ownerId = useUserStore((state) => state.user?.id);
  const online = useNetworkStatus();
  const queuedReports = useQueuedReports(ownerId);

  useReportSync(ownerId);
  useOfflinePageWarmup(shellPaths);

  const rejectedCount = queuedReports.filter(
    (entry) => entry.status === 'rejected'
  ).length;

  return (
    <NetworkStatusIndicator
      online={online}
      pendingCount={queuedReports.length - rejectedCount}
      rejectedCount={rejectedCount}
    />
  );
}
