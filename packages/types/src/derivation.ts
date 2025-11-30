export enum DerivationStatus {
  PENDING = 'Pending',
  ONGOING = 'Ongoing',
  REVIEWING = 'Reviewing',
  REVISING = 'Revising',
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
  correctionComment: string | null;
}
