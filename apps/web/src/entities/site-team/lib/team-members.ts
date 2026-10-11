import { SiteTeamMember, SiteTeamWithMembers } from '../model/site-team.types';

export function getTeamMembers(
  teams: SiteTeamWithMembers[] | undefined,
  teamId: number | null | undefined
): SiteTeamMember[] {
  const team = teams?.find((candidate) => candidate.id === teamId);
  return team?.teamMemberships.map((membership) => membership.user) ?? [];
}

export function withCurrentAssignee(
  members: SiteTeamMember[],
  assignee: Omit<SiteTeamMember, 'role'> | null | undefined
): Array<Omit<SiteTeamMember, 'role'>> {
  if (!assignee || members.some((member) => member.id === assignee.id)) {
    return members;
  }
  return [...members, assignee];
}

export function formatMemberName(
  member: Pick<SiteTeamMember, 'firstName' | 'lastName'>
) {
  return `${member.firstName} ${member.lastName}`;
}
