import { CircuitBreakerType, DerivationStatus, VoltageType } from '@repo/types';
import { DerivationStatusConfig } from '@/types/derivations.type';

export const derivationStatusConfig: Record<
  DerivationStatus,
  DerivationStatusConfig
> = {
  [DerivationStatus.PENDING]: {
    text: 'À compléter',
    icon: 'mdi:clipboard-list',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  [DerivationStatus.ONGOING]: {
    text: 'En cours',
    icon: 'mdi:clock',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
  [DerivationStatus.REVIEWING]: {
    text: 'En attente de validation',
    icon: 'mdi:eye',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  [DerivationStatus.REVISING]: {
    text: 'En attente de correction',
    icon: 'mdi:refresh-cw',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  [DerivationStatus.INCORRECT]: {
    text: 'Incorrect',
    icon: 'mdi:alert-circle',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  [DerivationStatus.COMPLETED]: {
    text: 'Terminé',
    icon: 'mdi:check-circle',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
};

export const DEFAULT_FORM_VALUES = {
  clientInfo: {
    name: '',
    phone: '',
    folio: '',
  },
  generalInfo: {
    dateTime: new Date().toISOString(),
    derivationBy: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
    },
    building: '',
    cmIdentification: '',
    floor: '',
    situation: '',
    comment: '',
  },
  photoBeforeWork: {
    photo: null,
  },
  oldMeter: {
    type: '',
    generation: '',
    preserved: false,
    linkyRefusal: undefined,
    serialNumber: '',
    key: '',
    dayIndex: '',
    nightIndex: '',
    indexPhoto: undefined,
  },
  newDerivation: {
    section: '',
    cableType: '',
    length: 0,
  },
  newMeter: {
    generation: '',
    serialNumber: '',
    dayIndex: '',
    nightIndex: '',
    indexPhoto: null,
  },
  circuitBreaker: {
    preserved: false,
    voltage: 'mono' as VoltageType,
    brand: '',
    type: 'non_differentiel' as CircuitBreakerType,
    power: '',
    commissioningDone: false,
    sealed: false,
  },
  photoAfterWork: {
    photo: null,
    secondPhoto: null,
    thirdPhoto: null,
  },
  clientValidation: {
    present: true,
    workValidation: false,
    satisfactionLevel: '0',
    clientComment: '',
    signature: null,
    technicianComment: '',
  },
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
  ],
  5: [
    'newDerivation.section',
    'newDerivation.cableType',
    'newDerivation.length',
  ],
  6: [
    'newMeter.generation',
    'newMeter.serialNumber',
    'newMeter.dayIndex',
    'newMeter.indexPhoto',
  ],
  7: ['circuitBreaker.brand', 'circuitBreaker.power'],
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
