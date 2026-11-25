import { z } from 'zod';
import { DerivationStatus } from '@repo/types';

export const REVIEW_DECISIONS = [
  DerivationStatus.COMPLETED,
  DerivationStatus.REVISING,
] as const;

export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];

export const CORRECTION_COMMENT_MAX_LENGTH = 255;

export const isReviewDecision = (
  status: DerivationStatus
): status is ReviewDecision =>
  (REVIEW_DECISIONS as readonly DerivationStatus[]).includes(status);

export const correctionFormSchema = z
  .object({
    correctionComment: z.string().max(CORRECTION_COMMENT_MAX_LENGTH, {
      message: `Le commentaire ne peut pas dépasser ${CORRECTION_COMMENT_MAX_LENGTH} caractères`,
    }),
    status: z.enum(REVIEW_DECISIONS, {
      errorMap: () => ({ message: 'Veuillez choisir une décision' }),
    }),
  })
  .refine(
    (values) =>
      values.status !== DerivationStatus.REVISING ||
      values.correctionComment.trim().length > 0,
    {
      path: ['correctionComment'],
      message:
        'Un commentaire de correction est obligatoire pour renvoyer le relevé au technicien',
    }
  );

export type CorrectionFormValues = z.infer<typeof correctionFormSchema>;
