import { Chantier } from './chantier.js';

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
  chantierId: number | null;
  chantier: Chantier | null;
  createdAt: string;
  status: DerivationStatus;
  correctionComment: string | null;
}
