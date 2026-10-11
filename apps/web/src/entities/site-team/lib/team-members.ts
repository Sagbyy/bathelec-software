import { SiteTeamMember, SiteTeamWithMembers } from '../model/site-team.types';

export function getTeamMembers(
  teams: SiteTeamWithMembers[] | undefined,
  teamId: number | null | undefined
): SiteTeamMember[] {
  const team = teams?.find((candidate) => candidate.id === teamId);
  return team?.teamMemberships.map((membership) => membership.user) ?? [];
}

export function formatMemberName(member: SiteTeamMember) {
  return `${member.firstName} ${member.lastName}`;
}
