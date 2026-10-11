import { describe, it, expect } from 'vitest';
import { Role } from '@repo/types';
import { getAssignmentAction } from './derivation-assignment';

const technician = { id: 42, role: Role.TECHNICIAN };
const siteManager = { id: 7, role: Role.SITE_MANAGER };

describe('getAssignmentAction', () => {
  it('lets a site manager assign any derivation of the team', () => {
    expect(getAssignmentAction({ userId: null }, siteManager)).toBe('assign');
    expect(getAssignmentAction({ userId: 42 }, siteManager)).toBe('assign');
  });

  it('lets a technician claim an unassigned derivation', () => {
    expect(getAssignmentAction({ userId: null }, technician)).toBe('claim');
  });

  it('lets a technician open a derivation assigned to them', () => {
    expect(getAssignmentAction({ userId: 42 }, technician)).toBe('open');
  });

  it('offers nothing on a derivation assigned to someone else', () => {
    expect(getAssignmentAction({ userId: 99 }, technician)).toBe('none');
  });
});
