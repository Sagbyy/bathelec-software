import { DerivationStatus } from '@repo/types';
import { DerivationStatusConfig } from './derivations.type';

export const derivationStatusConfig: Record<
  DerivationStatus,
  DerivationStatusConfig
> = {
  [DerivationStatus.PENDING]: {
    text: 'À compléter',
    icon: 'mdi:clipboard-list-outline',
    tone: 'warning',
    textColor: 'text-warning',
    textDarkColor: 'text-warning-soft-foreground',
    backgroundColor: 'bg-warning-soft',
  },
  [DerivationStatus.ONGOING]: {
    text: 'En cours',
    icon: 'mdi:clock-outline',
    tone: 'neutral',
    textColor: 'text-muted-foreground',
    textDarkColor: 'text-foreground',
    backgroundColor: 'bg-muted',
  },
  [DerivationStatus.REVIEWING]: {
    text: 'En attente de validation',
    icon: 'mdi:eye-outline',
    tone: 'info',
    textColor: 'text-info',
    textDarkColor: 'text-info-soft-foreground',
    backgroundColor: 'bg-info-soft',
  },
  [DerivationStatus.REVISING]: {
    text: 'En attente de correction',
    icon: 'mdi:close-circle-outline',
    tone: 'brand',
    textColor: 'text-primary',
    textDarkColor: 'text-primary-soft-foreground',
    backgroundColor: 'bg-primary-soft',
  },
  [DerivationStatus.COMPLETED]: {
    text: 'Terminé',
    icon: 'mdi:check-circle-outline',
    tone: 'success',
    textColor: 'text-success',
    textDarkColor: 'text-success-soft-foreground',
    backgroundColor: 'bg-success-soft',
  },
};
