import { Market } from './market.js';

export interface Chantier {
  id: number;
  address: string;
  enedisAffaireNumber: string;
  internalAffaireNumber: string;
  marketId: number;
  market?: Market;
  createdAt: string;
  updatedAt: string;
}
