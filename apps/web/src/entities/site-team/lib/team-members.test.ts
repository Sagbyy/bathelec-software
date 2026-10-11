import { describe, it, expect } from 'vitest';
import { Role } from '@repo/types';
import { formatMemberName, getTeamMembers } from './team-members';
import { SiteTeamWithMembers } from '../model/site-team.types';

const alice = {
  id: 1,
  firstName: 'Alice',
  lastName: 'Martin',
  role: Role.TECHNICIAN,
};
const bob = {
  id: 2,
  firstName: 'Bob',
  lastName: 'Durand',
  role: Role.SITE_MANAGER,
};

const teams: SiteTeamWithMembers[] = [
  { id: 10, name: 'Nord', teamMemberships: [{ user: alice }, { user: bob }] },
  { id: 11, name: 'Sud', teamMemberships: [] },
];

describe('getTeamMembers', () => {
  it('returns the members of the selected team', () => {
    expect(getTeamMembers(teams, 10)).toEqual([alice, bob]);
  });

  it('returns an empty list for a team without members', () => {
    expect(getTeamMembers(teams, 11)).toEqual([]);
  });

  it('returns an empty list when no team is selected or teams are not loaded', () => {
    expect(getTeamMembers(teams, null)).toEqual([]);
    expect(getTeamMembers(undefined, 10)).toEqual([]);
  });
});

describe('formatMemberName', () => {
  it('joins first and last names', () => {
    expect(formatMemberName(alice)).toBe('Alice Martin');
  });
});
