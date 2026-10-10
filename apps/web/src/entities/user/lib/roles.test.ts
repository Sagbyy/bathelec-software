import { describe, it, expect } from 'vitest';
import { Role } from '@repo/types';
import { isManagementRole } from './roles';

describe('isManagementRole', () => {
  it('returns true for admin, supervisor and site manager', () => {
    expect(isManagementRole(Role.ADMIN)).toBe(true);
    expect(isManagementRole(Role.SUPERVISOR)).toBe(true);
    expect(isManagementRole(Role.SITE_MANAGER)).toBe(true);
  });

  it('returns false for technician', () => {
    expect(isManagementRole(Role.TECHNICIAN)).toBe(false);
  });

  it('returns false for an unknown role', () => {
    expect(isManagementRole('unknown')).toBe(false);
  });
});
