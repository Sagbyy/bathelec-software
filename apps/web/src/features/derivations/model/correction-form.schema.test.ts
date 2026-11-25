import { describe, it, expect } from 'vitest';
import { DerivationStatus } from '@repo/types';
import {
  correctionFormSchema,
  isReviewDecision,
} from './correction-form.schema';

describe('correctionFormSchema', () => {
  it('validates a derivation without comment', () => {
    expect(
      correctionFormSchema.safeParse({
        status: DerivationStatus.COMPLETED,
        correctionComment: '',
      }).success
    ).toBe(true);
  });

  it('sends back for correction with a comment', () => {
    expect(
      correctionFormSchema.safeParse({
        status: DerivationStatus.REVISING,
        correctionComment: 'Photo de l’index floue',
      }).success
    ).toBe(true);
  });

  it.each([[''], ['   ']])(
    'requires a correction comment to send back (%j)',
    (correctionComment) => {
      const result = correctionFormSchema.safeParse({
        status: DerivationStatus.REVISING,
        correctionComment,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toEqual(['correctionComment']);
    }
  );

  it.each([
    [DerivationStatus.PENDING],
    [DerivationStatus.ONGOING],
    [DerivationStatus.REVIEWING],
  ])('rejects %s which is not a review decision', (status) => {
    expect(
      correctionFormSchema.safeParse({ status, correctionComment: 'x' }).success
    ).toBe(false);
  });

  it('limits the comment to 255 characters', () => {
    expect(
      correctionFormSchema.safeParse({
        status: DerivationStatus.REVISING,
        correctionComment: 'a'.repeat(256),
      }).success
    ).toBe(false);
  });
});

describe('isReviewDecision', () => {
  it.each([
    [DerivationStatus.COMPLETED, true],
    [DerivationStatus.REVISING, true],
    [DerivationStatus.REVIEWING, false],
    [DerivationStatus.PENDING, false],
  ])('%s → %s', (status, expected) => {
    expect(isReviewDecision(status)).toBe(expected);
  });
});
