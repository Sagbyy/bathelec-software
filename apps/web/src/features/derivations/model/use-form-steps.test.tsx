import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  completedDerivationResolver,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { INVALID_SUBMISSION_MESSAGE, useFormSteps } from './use-form-steps';

const toastError = vi.fn();

vi.mock('sonner', () => ({
  toast: { error: (message: string) => toastError(message) },
}));

const PHOTO = 'data:image/jpeg;base64,AAAA';

const validValues = {
  clientInfo: {
    name: 'M. DUPONT',
    phone: '+33612345678',
    folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
  },
  generalInfo: {
    dateTime: new Date('2025-01-01T10:00:00.000Z').toISOString(),
    derivationBy: 'Technicien A',
    address: { street: '1 rue de la Paix', postalCode: '75001', city: 'Paris' },
    building: 'A',
    cmIdentification: 'CM001',
    floor: '1',
    situation: 'gauche',
    comment: '',
  },
  photoBeforeWork: { photo: PHOTO },
  oldMeter: {
    type: 'electromecanique',
    generation: '',
    preserved: false,
    linkyRefusal: false,
    serialNumber: '123',
    key: '',
    dayIndex: '1000',
    nightIndex: '',
    indexPhoto: PHOTO,
  },
  newDerivation: { section: '2x16', cableType: 'cuivre', length: 8 },
  newMeter: {
    generation: 'g3',
    serialNumber: '123456789012',
    key: '34',
    dayIndex: '0',
    nightIndex: '',
    indexPhoto: PHOTO,
  },
  circuitBreaker: {
    preserved: false,
    voltage: 'mono',
    brand: 'Schneider',
    type: 'differentiel',
    power: '15-45',
    calibrationPower: '45',
    commissioningDone: true,
    sealed: true,
    testButton: null,
    replacementExplanation: '',
  },
  photoAfterWork: { photo: PHOTO, secondPhoto: null, thirdPhoto: null },
  clientValidation: {
    present: false,
    workValidation: false,
    satisfactionLevel: '0',
    clientComment: '',
    signature: null,
    technicianComment: '',
    technicianNothingToReport: true,
    technicianSignature: 'data:image/png;base64,tech',
  },
} as unknown as CreateCompletedDerivation;

const renderSteps = (values: CreateCompletedDerivation = validValues) => {
  const onSubmit = vi.fn();
  const hook = renderHook(() => {
    const form = useForm<CreateCompletedDerivation>({
      resolver: completedDerivationResolver,
      defaultValues: values,
    });
    return { form, steps: useFormSteps({ form, onSubmit }) };
  });
  return { ...hook, onSubmit };
};

const goToLastStep = async (
  result: ReturnType<typeof renderSteps>['result']
) => {
  while (result.current.steps.step < result.current.steps.totalSteps) {
    const before = result.current.steps.step;
    await act(() => result.current.steps.nextStep());
    if (result.current.steps.step === before) {
      throw new Error(`Blocked at step ${before}`);
    }
  }
};

describe('useFormSteps', () => {
  beforeEach(() => {
    toastError.mockReset();
    window.scrollTo = vi.fn();
  });

  it('submits the parsed values once the whole form is valid', async () => {
    const { result, onSubmit } = renderSteps();

    await goToLastStep(result);
    await act(() => result.current.steps.nextStep());

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0].clientInfo.folio).toBe(
      'SGX001 - COM001 - ASC001 - 001 - 101'
    );
  });

  it('blocks the submission and goes back to the failing step when an earlier step became invalid', async () => {
    const { result, onSubmit } = renderSteps();

    await goToLastStep(result);
    act(() => {
      result.current.form.setValue('circuitBreaker.sealed', false);
    });
    await act(() => result.current.steps.nextStep());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.steps.step).toBe(7);
    expect(
      result.current.form.getFieldState('circuitBreaker.sealed').error?.message
    ).toBe('Le plombage du disjoncteur est obligatoire');
    expect(toastError).toHaveBeenCalledWith(INVALID_SUBMISSION_MESSAGE);
  });

  it('blocks the submission when the old meter index photo is missing (RG-09)', async () => {
    const { result, onSubmit } = renderSteps();

    await goToLastStep(result);
    act(() => {
      result.current.form.setValue('oldMeter.indexPhoto', null);
    });
    await act(() => result.current.steps.nextStep());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.steps.step).toBe(4);
  });

  it('refuses to leave the circuit breaker step while it is not sealed (RG-06)', async () => {
    const { result } = renderSteps({
      ...validValues,
      circuitBreaker: { ...validValues.circuitBreaker, sealed: false },
    });

    await expect(goToLastStep(result)).rejects.toThrow('Blocked at step 7');
  });

  it('skips the new meter step but keeps the circuit breaker on Linky refusal', async () => {
    const { result } = renderSteps({
      ...validValues,
      oldMeter: { ...validValues.oldMeter, linkyRefusal: true },
      newMeter: {
        ...validValues.newMeter,
        serialNumber: '',
        indexPhoto: null,
      },
    });

    expect(result.current.steps.totalSteps).toBe(8);
    for (let step = 1; step <= 5; step++) {
      expect(result.current.steps.getActualStep(step)).toBe(step);
    }
    expect(result.current.steps.getActualStep(6)).toBe(7);
    expect(result.current.steps.getActualStep(8)).toBe(9);

    await goToLastStep(result);
    expect(result.current.steps.step).toBe(8);
  });

  it('submits an absent client without client signature', async () => {
    const { result, onSubmit } = renderSteps();

    await goToLastStep(result);
    await act(() => result.current.steps.nextStep());

    expect(onSubmit.mock.calls[0]![0].clientValidation.signature).toBeNull();
  });
});
