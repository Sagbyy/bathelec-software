import { Chantier } from './chantier.js';

export enum DerivationStatus {
  PENDING = 'Pending',
  ONGOING = 'Ongoing',
  REVIEWING = 'Reviewing',
  REVISING = 'Revising',
  INCORRECT = 'Incorrect',
  COMPLETED = 'Completed',
}

export interface DerivationTeam {
  id: number;
  name: string;
}

export interface Derivation {
  id: number;
  userId: number | null;
  chantierId: number | null;
  chantier: Chantier | null;
  createdAt: string;
  status: DerivationStatus;
  correctionComment: string | null;
  teamId: number | null;
  team?: DerivationTeam | null;
}
