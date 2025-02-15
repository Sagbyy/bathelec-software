export enum DerivationStatus {
  PENDING = 'Pending',
  INCORRECT = 'Incorrect',
  COMPLETED = 'Completed',
}

export interface Derivation {
  id: number;
  userId: number;
  address: string;
  city: string;
  postalCode: string;
  createdAt: string;
  status: DerivationStatus;
}
