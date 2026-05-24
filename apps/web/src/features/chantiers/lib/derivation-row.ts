import { CompletedDerivation, Derivation, DerivationStatus } from '@repo/types';

export interface DerivationRow {
  id: number;
  status: DerivationStatus;
  building: string;
  cmIdentification: string;
  folio: string;
  floor: string;
  electricianName: string;
  clientName: string;
  completedAt: string | null;
}

export function toDerivationRow(
  derivation: Derivation,
  completed: CompletedDerivation | undefined
): DerivationRow {
  return {
    id: derivation.id,
    status: derivation.status,
    building: completed?.generalInfo?.building ?? '',
    cmIdentification: completed?.generalInfo?.cmIdentification ?? '',
    folio: completed?.clientInfo?.folio ?? '',
    floor: completed?.generalInfo?.floor ?? '',
    electricianName: completed?.generalInfo?.derivationBy ?? '',
    clientName: completed?.clientInfo?.name ?? '',
    completedAt: completed?.updatedAt ?? completed?.createdAt ?? null,
  };
}
