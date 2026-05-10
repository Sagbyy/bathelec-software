import { DerivationStatus } from '@repo/types';
import { DerivationStatusConfig } from '@/types/derivations.type';

export const derivationStatusConfig: Record<
  DerivationStatus,
  DerivationStatusConfig
> = {
  [DerivationStatus.PENDING]: {
    text: 'À compléter',
    icon: 'mdi:clipboard-list-outline',
    textColor: 'text-yellow-500',
    textDarkColor: 'text-yellow-800',
    backgroundColor: 'bg-yellow-100',
  },
  [DerivationStatus.ONGOING]: {
    text: 'En cours',
    icon: 'mdi:clock-outline',
    textColor: 'text-slate-500',
    textDarkColor: 'text-slate-800',
    backgroundColor: 'bg-slate-100',
  },
  [DerivationStatus.REVIEWING]: {
    text: 'En attente de validation',
    icon: 'mdi:eye-outline',
    textColor: 'text-blue-500',
    textDarkColor: 'text-blue-800',
    backgroundColor: 'bg-blue-100',
  },
  [DerivationStatus.REVISING]: {
    text: 'En attente de correction',
    icon: 'mdi:close-circle-outline',
    textColor: 'text-orange-500',
    textDarkColor: 'text-orange-800',
    backgroundColor: 'bg-orange-100',
  },
  [DerivationStatus.INCORRECT]: {
    text: 'Incorrect',
    icon: 'mdi:alert-circle-outline',
    textColor: 'text-red-500',
    textDarkColor: 'text-red-800',
    backgroundColor: 'bg-red-100',
  },
  [DerivationStatus.COMPLETED]: {
    text: 'Terminé',
    icon: 'mdi:check-circle-outline',
    textColor: 'text-green-500',
    textDarkColor: 'text-green-800',
    backgroundColor: 'bg-green-100',
  },
};
