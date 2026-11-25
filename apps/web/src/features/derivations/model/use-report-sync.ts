'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { startBackgroundSync, useOutboxEntries } from '@/shared/lib/offline';
import { reportOutbox } from './report-offline-store';

export const syncedReportsMessage = (count: number) =>
  count === 1
    ? '1 relevé enregistré hors ligne a été envoyé.'
    : `${count} relevés enregistrés hors ligne ont été envoyés.`;

export const rejectedReportMessage = (derivationId: number, reason?: string) =>
  `Le relevé de la dérivation n°${derivationId} a été refusé par le serveur${
    reason ? ` : ${reason}` : '.'
  } Ouvrez-le pour le corriger puis soumettez-le à nouveau.`;

export const useReportSync = (ownerId: number | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (ownerId === undefined) {
      return;
    }

    return startBackgroundSync(async ({ force }) => {
      const { sent, rejected } = await reportOutbox.flush(ownerId, { force });

      if (sent.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['derivations'] });
        sent.forEach((entry) => {
          queryClient.invalidateQueries({
            queryKey: ['derivation', entry.targetId],
          });
          queryClient.invalidateQueries({
            queryKey: ['completed-derivations', entry.targetId],
          });
        });
        toast.success(syncedReportsMessage(sent.length));
      }

      rejected.forEach((entry) =>
        toast.error(rejectedReportMessage(entry.targetId, entry.lastError))
      );
    });
  }, [ownerId, queryClient]);
};

export const useQueuedReports = (ownerId: number | undefined) =>
  useOutboxEntries(reportOutbox, ownerId);

export const useQueuedReport = (
  ownerId: number | undefined,
  derivationId: number
) =>
  useQueuedReports(ownerId).find((entry) => entry.targetId === derivationId);
