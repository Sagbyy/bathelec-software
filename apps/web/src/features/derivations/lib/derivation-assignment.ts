import { Derivation, Role } from '@repo/types';

export type AssignmentAction = 'assign' | 'claim' | 'open' | 'none';

export function getAssignmentAction(
  derivation: Pick<Derivation, 'userId' | 'teamId'>,
  currentUser: { id: number; role: Role },
  memberTeamIds: number[]
): AssignmentAction {
  const isInTeam =
    derivation.teamId !== null && memberTeamIds.includes(derivation.teamId);
  const isMine = derivation.userId === currentUser.id;

  if (currentUser.role === Role.SITE_MANAGER && isInTeam) return 'assign';
  if (isMine) return 'open';
  if (derivation.userId === null && isInTeam) return 'claim';
  return 'none';
}
