export const TOTAL_STEPS = 9;

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
  ],
  8: ['photoAfterWork.photo'],
  9: {
    present: [
      'clientValidation.workValidation',
      'clientValidation.satisfactionLevel',
      'clientValidation.signature',
      'clientValidation.technicianComment',
    ],
    absent: ['clientValidation.technicianComment'],
  },
};
