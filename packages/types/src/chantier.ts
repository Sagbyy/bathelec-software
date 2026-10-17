import { Market } from './market.js';
import { Derivation } from './derivation.js';

export interface Chantier {
  id: number;
  address: string;
  enedisAffaireNumber: string;
  internalAffaireNumber: string;
  marketId: number;
  startDate?: string | null;
  endDate?: string | null;
  market?: Market;
  derivations?: Derivation[];
  createdAt: string;
  updatedAt: string;
}
