'use client';

import { useEffect, useRef, useState } from 'react';
import type { DefaultValues, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import type { CompletedDerivation } from '@repo/types';
import type { CreateCompletedDerivation } from '@/entities/derivation';
import { formatCompletedDerivation } from '../lib/format-completed-derivation';
import { pickReportSource } from '../lib/report-source';
import { reportDrafts } from './report-offline-store';

export const DRAFT_SAVE_DELAY_MS = 500;
export const DRAFT_RESTORED_MESSAGE =
  'Brouillon restauré : vos saisies enregistrées sur cet appareil ont été récupérées.';

interface UseReportDraftOptions {
  form: UseFormReturn<CreateCompletedDerivation>;
  ownerId: number | undefined;
  derivationId: number;
  enabled: boolean;
  discard: boolean;
  serverReport: CompletedDerivation | null | undefined;
  isServerReportLoading: boolean;
  step: number;
  onRestoreStep: (step: number) => void;
}

const toFormValues = (report: CompletedDerivation) =>
  formatCompletedDerivation(
    report
  ) as unknown as DefaultValues<CreateCompletedDerivation>;

export const useReportDraft = ({
  form,
  ownerId,
  derivationId,
  enabled,
  discard,
  serverReport,
  isServerReportLoading,
  step,
  onRestoreStep,
}: UseReportDraftOptions) => {
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);
  const stepRef = useRef(step);
  const savedStep = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (discard && ownerId !== undefined) {
      reportDrafts.clear(ownerId, derivationId).catch(() => undefined);
    }
  }, [discard, ownerId, derivationId]);

  useEffect(() => {
    if (
      !enabled ||
      ownerId === undefined ||
      isServerReportLoading ||
      initialized.current
    ) {
      return;
    }

    let cancelled = false;
    reportDrafts
      .load(ownerId, derivationId)
      .catch(() => undefined)
      .then((draft) => {
        if (cancelled || initialized.current) return;
        initialized.current = true;

        if (draft && pickReportSource(draft, serverReport) === 'draft') {
          form.reset(draft.values);
          savedStep.current = draft.step;
          onRestoreStep(draft.step);
          toast.info(DRAFT_RESTORED_MESSAGE);
        } else if (serverReport) {
          form.reset(toFormValues(serverReport));
        }
        setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    ownerId,
    derivationId,
    isServerReportLoading,
    serverReport,
    form,
    onRestoreStep,
  ]);

  useEffect(() => {
    if (!enabled || !isReady || ownerId === undefined) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      timer = undefined;
      savedStep.current = stepRef.current;
      reportDrafts
        .save(ownerId, derivationId, {
          values: form.getValues(),
          step: stepRef.current,
        })
        .catch(() => undefined);
    };
    const flush = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        save();
      }
    };
    const schedule = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(save, DRAFT_SAVE_DELAY_MS);
    };
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    const subscription = form.watch(schedule);
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', flush);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [enabled, isReady, ownerId, derivationId, form]);

  useEffect(() => {
    if (
      !enabled ||
      !isReady ||
      ownerId === undefined ||
      step === savedStep.current
    ) {
      return;
    }
    savedStep.current = step;
    reportDrafts
      .save(ownerId, derivationId, { values: form.getValues(), step })
      .catch(() => undefined);
  }, [enabled, isReady, ownerId, derivationId, form, step]);

  return { isReady };
};
