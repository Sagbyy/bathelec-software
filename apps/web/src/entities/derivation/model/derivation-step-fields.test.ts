import { describe, it, expect } from 'vitest';
import {
  findFirstInvalidStep,
  getFieldsToValidate,
  getStepNumber,
  getVisibleSteps,
} from './derivation-step-fields';

describe('getVisibleSteps', () => {
  it('shows the nine steps when a new meter is installed', () => {
    expect(getVisibleSteps({ preserved: false, linkyRefusal: false })).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it.each([
    { preserved: true, linkyRefusal: false },
    { preserved: false, linkyRefusal: true },
    { preserved: true, linkyRefusal: true },
  ])(
    'skips only the new meter step and keeps the circuit breaker (%j)',
    (outcome) => {
      expect(getVisibleSteps(outcome)).toEqual([1, 2, 3, 4, 5, 7, 8, 9]);
    }
  );
});

describe('getStepNumber', () => {
  it('keeps the form step number when every step is shown', () => {
    expect(getStepNumber(7, { preserved: false })).toBe(7);
  });

  it('renumbers the steps following a skipped new meter', () => {
    expect(getStepNumber(7, { linkyRefusal: true })).toBe(6);
    expect(getStepNumber(9, { preserved: true })).toBe(8);
  });
});

describe('getFieldsToValidate', () => {
  it('validates the sealing on the circuit breaker step (RG-06)', () => {
    expect(getFieldsToValidate(7, true)).toContain('circuitBreaker.sealed');
  });

  it('validates the old meter index photo on the old meter step (RG-09)', () => {
    expect(getFieldsToValidate(4, true)).toContain('oldMeter.indexPhoto');
  });

  it('requires the client signature only when the client is present', () => {
    expect(getFieldsToValidate(9, true)).toContain(
      'clientValidation.signature'
    );
    expect(getFieldsToValidate(9, false)).not.toContain(
      'clientValidation.signature'
    );
  });

  it('returns nothing for an unknown step', () => {
    expect(getFieldsToValidate(42, true)).toEqual([]);
  });
});

describe('findFirstInvalidStep', () => {
  const allSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('returns the earliest step holding an error', () => {
    expect(
      findFirstInvalidStep(['photoAfterWork', 'circuitBreaker'], allSteps)
    ).toBe(7);
  });

  it('ignores errors of a hidden step', () => {
    expect(
      findFirstInvalidStep(['newMeter'], [1, 2, 3, 4, 5, 7, 8, 9])
    ).toBeNull();
  });

  it('returns null without error', () => {
    expect(findFirstInvalidStep([], allSteps)).toBeNull();
  });
});
