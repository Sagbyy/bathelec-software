import type { Draft } from '@/shared/lib/offline';

export type ReportSource = 'draft' | 'server';

interface ServerReportTimestamps {
  updatedAt?: string;
  createdAt?: string;
}

const serverReportTime = (report: ServerReportTimestamps) => {
  const timestamp = Date.parse(report.updatedAt ?? report.createdAt ?? '');
  return Number.isNaN(timestamp) ? undefined : timestamp;
};

export const pickReportSource = <V>(
  draft: Draft<V> | undefined,
  serverReport: ServerReportTimestamps | null | undefined
): ReportSource => {
  if (!draft) {
    return 'server';
  }
  if (!serverReport) {
    return 'draft';
  }
  const serverTime = serverReportTime(serverReport);
  return serverTime === undefined || draft.savedAt >= serverTime
    ? 'draft'
    : 'server';
};
