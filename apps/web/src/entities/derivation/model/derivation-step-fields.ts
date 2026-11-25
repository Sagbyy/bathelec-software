import { isNewMeterInstalled, type OldMeterOutcome } from '@repo/types';

export const TOTAL_STEPS = 9;

export const NEW_METER_STEP = 6;

export const CLIENT_VALIDATION_STEP = 9;

export const STEP_SECTIONS: Record<number, string> = {
  1: 'clientInfo',
  2: 'generalInfo',
  3: 'photoBeforeWork',
  4: 'oldMeter',
  5: 'newDerivation',
  6: 'newMeter',
  7: 'circuitBreaker',
  8: 'photoAfterWork',
  9: 'clientValidation',
};

export const STEP_FIELDS_TO_VALIDATE: {
  [key: number]: string[] | { present: string[]; absent: string[] };
} = {
  1: ['clientInfo.name', 'clientInfo.phone', 'clientInfo.folio'],
  2: [
    'generalInfo.dateTime',
    'generalInfo.derivationBy',
    'generalInfo.address.street',
    'generalInfo.address.postalCode',
    'generalInfo.address.city',
    'generalInfo.building',
    'generalInfo.cmIdentification',
    'generalInfo.floor',
    'generalInfo.situation',
  ],
  3: ['photoBeforeWork.photo'],
  4: [
    'oldMeter.type',
    'oldMeter.generation',
    'oldMeter.serialNumber',
    'oldMeter.key',
    'oldMeter.dayIndex',
    'oldMeter.indexPhoto',
  ],
  5: [
    'newDerivation.section',
    'newDerivation.cableType',
    'newDerivation.length',
  ],
  6: [
    'newMeter.generation',
    'newMeter.serialNumber',
    'newMeter.key',
    'newMeter.dayIndex',
    'newMeter.indexPhoto',
  ],
  7: [
    'circuitBreaker.voltage',
    'circuitBreaker.brand',
    'circuitBreaker.type',
    'circuitBreaker.power',
    'circuitBreaker.calibrationPower',
    'circuitBreaker.sealed',
    'circuitBreaker.testButton',
    'circuitBreaker.replacementExplanation',
  ],
  8: [
    'photoAfterWork.photo',
    'photoAfterWork.secondPhoto',
    'photoAfterWork.thirdPhoto',
  ],
  9: {
    present: [
      'clientValidation.workValidation',
      'clientValidation.satisfactionLevel',
      'clientValidation.signature',
      'clientValidation.technicianComment',
      'clientValidation.technicianSignature',
    ],
    absent: [
      'clientValidation.technicianComment',
      'clientValidation.technicianSignature',
    ],
  },
};

const ALL_STEPS = Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1);

export function getVisibleSteps(oldMeter: OldMeterOutcome): number[] {
  return isNewMeterInstalled(oldMeter)
    ? ALL_STEPS
    : ALL_STEPS.filter((step) => step !== NEW_METER_STEP);
}

export function getStepNumber(
  formStep: number,
  oldMeter: OldMeterOutcome
): number {
  const position = getVisibleSteps(oldMeter).indexOf(formStep);
  return position === -1 ? formStep : position + 1;
}

export function getFieldsToValidate(
  formStep: number,
  clientPresent: boolean
): string[] {
  const fields = STEP_FIELDS_TO_VALIDATE[formStep];

  if (!fields) {
    return [];
  }

  if (Array.isArray(fields)) {
    return fields;
  }

  return clientPresent ? fields.present : fields.absent;
}

export function findFirstInvalidStep(
  invalidSections: string[],
  visibleSteps: number[]
): number | null {
  const invalidStep = visibleSteps.find((step) =>
    invalidSections.includes(STEP_SECTIONS[step] ?? '')
  );

  return invalidStep ?? null;
}
