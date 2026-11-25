'use client';

import { CloudOff, TriangleAlert } from 'lucide-react';
import type { OutboxEntry } from '@/shared/lib/offline';
import { cn } from '@/shared/lib/utils';
import { REPORT_QUEUED_MESSAGE } from '../model/use-derivation-submit';

interface QueuedReportNoticeProps {
  entry: Pick<OutboxEntry<unknown>, 'status' | 'lastError'> | undefined;
}

export function QueuedReportNotice({ entry }: QueuedReportNoticeProps) {
  if (!entry) return null;

  const isRejected = entry.status === 'rejected';
  const Icon = isRejected ? TriangleAlert : CloudOff;

  return (
    <div
      role="status"
      className={cn(
        'mb-4 flex items-start gap-2.5 rounded-lg border p-3 text-sm',
        isRejected
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-warning/20 bg-warning-soft text-warning-soft-foreground'
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <p>
        {isRejected
          ? `Envoi refusé par le serveur${entry.lastError ? ` : ${entry.lastError}` : '.'} Corrigez le relevé puis soumettez-le à nouveau.`
          : REPORT_QUEUED_MESSAGE}
      </p>
    </div>
  );
}
