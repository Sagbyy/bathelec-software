import { describe, it, expect } from 'vitest';
import { Role } from '@repo/types';
import { getAssignmentAction } from './derivation-assignment';

const technician = { id: 42, role: Role.TECHNICIAN };
const siteManager = { id: 7, role: Role.SITE_MANAGER };
const teams = [3];

describe('getAssignmentAction', () => {
  it('lets a site manager assign any derivation of their team', () => {
    expect(
      getAssignmentAction({ userId: null, teamId: 3 }, siteManager, teams)
    ).toBe('assign');
    expect(
      getAssignmentAction({ userId: 42, teamId: 3 }, siteManager, teams)
    ).toBe('assign');
  });

  it('only lets a site manager open their own derivation from a team they left', () => {
    expect(
      getAssignmentAction({ userId: 7, teamId: 5 }, siteManager, teams)
    ).toBe('open');
    expect(
      getAssignmentAction({ userId: 42, teamId: 5 }, siteManager, teams)
    ).toBe('none');
  });

  it('lets a technician claim an unassigned derivation of their team', () => {
    expect(
      getAssignmentAction({ userId: null, teamId: 3 }, technician, teams)
    ).toBe('claim');
  });

  it('does not let a technician claim outside their teams', () => {
    expect(
      getAssignmentAction({ userId: null, teamId: 5 }, technician, teams)
    ).toBe('none');
  });

  it('lets a technician open a derivation assigned to them', () => {
    expect(
      getAssignmentAction({ userId: 42, teamId: 3 }, technician, teams)
    ).toBe('open');
  });

  it('offers nothing on a derivation assigned to someone else', () => {
    expect(
      getAssignmentAction({ userId: 99, teamId: 3 }, technician, teams)
    ).toBe('none');
  });
});
