export type VoltageType = 'mono' | 'tri';
export type CircuitBreakerType =
  | 'non_differentiel'
  | 'differentiel'
  | 'selectif';

export interface ClientInfo {
  name: string;
  phone: string;
  folio: string;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
}

export interface GeneralInfo {
  dateTime: Date;
  derivationBy: string;
  address: Address;
  building: string;
  cmIdentification: string;
  floor: string;
  situation: string;
  comment: string;
}

export interface PhotoBeforeWork {
  photo: string;
}

export interface OldMeter {
  type: string;
  generation: string;
  preserved: boolean;
  serialNumber: string;
  key: string;
  dayIndex: string;
  nightIndex: string;
}

export interface NewDerivation {
  section: string;
  cableType: string;
  length: number;
}

export interface NewMeter {
  generation: string;
  serialNumber: string;
  dayIndex: string;
  nightIndex: string;
  indexPhoto: string;
}

export interface CircuitBreaker {
  preserved: boolean;
  voltage: VoltageType;
  brand: string;
  type: CircuitBreakerType;
  power: string;
  commissioningDone: boolean;
  sealed: boolean;
}

export interface PhotoAfterWork {
  photo: string;
  secondPhoto?: string;
  thirdPhoto?: string;
}

export interface ClientValidation {
  present: boolean;
  workValidation: boolean;
  satisfactionLevel: string;
  clientComment: string;
  signature: string;
  technicianComment: string;
}

export interface CompletedDerivation {
  requestedDerivationId: number;
  clientInfo: ClientInfo;
  generalInfo: GeneralInfo;
  photoBeforeWork: PhotoBeforeWork;
  oldMeter: OldMeter;
  newDerivation: NewDerivation;
  newMeter: NewMeter;
  circuitBreaker: CircuitBreaker;
  photoAfterWork: PhotoAfterWork;
  clientValidation: ClientValidation;
  createdAt?: string;
  updatedAt?: string;
}
