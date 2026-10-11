import { Derivation, Role } from '@repo/types';

export type AssignmentAction = 'assign' | 'claim' | 'open' | 'none';

export function getAssignmentAction(
  derivation: Pick<Derivation, 'userId'>,
  currentUser: { id: number; role: Role }
): AssignmentAction {
  if (currentUser.role === Role.SITE_MANAGER) return 'assign';
  if (derivation.userId === null) return 'claim';
  if (derivation.userId === currentUser.id) return 'open';
  return 'none';
}
