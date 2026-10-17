import { Derivation } from '@repo/types';

export const getDerivationReference = ({
  id,
  folio,
}: Pick<Derivation, 'id' | 'folio'>) => folio || `Dérivation n°${id}`;
