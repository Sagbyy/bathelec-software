import { Role } from '@repo/types';
import { DerivationStatus } from '../../types/derivations-status.enum';

export interface DerivationActor {
  userId: number;
  role: string;
}

export interface DerivationOwnership {
  userId: number | null;
  teamId: number | null;
}

const MANAGEMENT_ROLES: string[] = [Role.ADMIN, Role.SUPERVISOR];

const FIELD_EDITABLE_STATUSES: string[] = [
  DerivationStatus.PENDING,
  DerivationStatus.ONGOING,
  DerivationStatus.REVISING,
];

export const REVIEW_DECISIONS = [
  DerivationStatus.COMPLETED,
  DerivationStatus.REVISING,
] as const;

export const isManagement = (actor: DerivationActor) =>
  MANAGEMENT_ROLES.includes(actor.role);

const isAssignee = (derivation: DerivationOwnership, actor: DerivationActor) =>
  derivation.userId === actor.userId;

export function canViewDerivation(
  derivation: DerivationOwnership,
  actor: DerivationActor,
  isActorTeamMember: boolean
): boolean {
  if (isManagement(actor) || isAssignee(derivation, actor)) {
    return true;
  }

  if (!isActorTeamMember) {
    return false;
  }

  return actor.role === Role.SITE_MANAGER || derivation.userId === null;
}

export function canFillDerivation(
  derivation: DerivationOwnership,
  actor: DerivationActor,
  isActorTeamMember: boolean
): boolean {
  if (isAssignee(derivation, actor)) {
    return true;
  }

  return derivation.userId === null && isActorTeamMember;
}

export const isEditableInTheField = (status: string) =>
  FIELD_EDITABLE_STATUSES.includes(status);

export const requiresCorrectionComment = (
  status: string | undefined,
  correctionComment: string | null | undefined
) => status === DerivationStatus.REVISING && !correctionComment?.trim();
