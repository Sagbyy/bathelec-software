import { DerivationStatus } from '@repo/types';

export interface UpdateDerivation {
  correctionComment: string | null;
  status: DerivationStatus | null;
}
