'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { type CreateCompletedDerivation } from '@/entities/derivation';
import { useUserStore } from '@/entities/user';
import { isBrowserOnline, type FlushOutcome } from '@/shared/lib/offline';
import { reportOutbox } from './report-offline-store';

export const REPORT_SENT_MESSAGE = 'Formulaire soumis avec succès !';
export const REPORT_QUEUED_MESSAGE =
  'Enregistré localement, sera envoyé dès le retour du réseau.';
export const REPORT_STORAGE_ERROR_MESSAGE =
  "Impossible d'enregistrer le relevé sur l'appareil.";

interface SubmitReportInput {
  ownerId: number;
  derivationId: number;
  values: CreateCompletedDerivation;
}

export const submitReport = async ({
  ownerId,
  derivationId,
  values,
}: SubmitReportInput): Promise<FlushOutcome> => {
  await reportOutbox.enqueue({
    ownerId,
    targetId: derivationId,
    payload: { ...values, requestedDerivationId: derivationId },
  });

  if (!isBrowserOnline()) {
    return { status: 'queued' };
  }

  const outcome = await reportOutbox.flushEntry(ownerId, derivationId);
  if (outcome.status === 'rejected') {
    await reportOutbox.remove(ownerId, derivationId);
  }
  return outcome;
};

export function useDerivationSubmit(derivationId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const ownerId = useUserStore((state) => state.user?.id);

  const { mutate, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: (values: CreateCompletedDerivation) => {
      if (ownerId === undefined) {
        throw new Error('Utilisateur non identifié.');
      }
      return submitReport({ ownerId, derivationId, values });
    },
    onSuccess: (outcome) => {
      if (outcome.status === 'queued') {
        toast.info(REPORT_QUEUED_MESSAGE);
        return;
      }
      if (outcome.status === 'rejected') {
        toast.error(outcome.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['derivation', derivationId] });
      queryClient.invalidateQueries({ queryKey: ['derivations'] });
      queryClient.invalidateQueries({
        queryKey: ['completed-derivations', derivationId],
      });
      toast.success(REPORT_SENT_MESSAGE);
      router.push(`/dashboard/technician/derivations/complete/${derivationId}`);
    },
    onError: (error) => {
      toast.error(`${REPORT_STORAGE_ERROR_MESSAGE} ${error.message}`);
    },
  });

  const submit = useCallback(
    (values: CreateCompletedDerivation) => mutate(values),
    [mutate]
  );

  return { submit, isSubmitting: isPending };
}
