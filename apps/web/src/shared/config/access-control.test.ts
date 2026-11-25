import { describe, it, expect } from 'vitest';
import { Role } from '@repo/types';
import { isProtectedPath, isRoleAllowedForPath } from './access-control';

describe('isProtectedPath', () => {
  it.each(['/dashboard', '/dashboard/admin/users', '/profile', '/protected/x'])(
    'protects %s',
    (pathname) => {
      expect(isProtectedPath(pathname)).toBe(true);
    }
  );

  it.each(['/', '/auth', '/dashboards', '/profiles'])(
    'does not protect %s',
    (pathname) => {
      expect(isProtectedPath(pathname)).toBe(false);
    }
  );
});

describe('isRoleAllowedForPath', () => {
  it.each([Role.ADMIN, Role.SUPERVISOR])(
    'allows %s in the admin area',
    (role) => {
      expect(isRoleAllowedForPath(role, '/dashboard/admin/users')).toBe(true);
    }
  );

  it.each([Role.TECHNICIAN, Role.SITE_MANAGER])(
    'denies %s in the admin area',
    (role) => {
      expect(isRoleAllowedForPath(role, '/dashboard/admin')).toBe(false);
      expect(isRoleAllowedForPath(role, '/dashboard/admin/users')).toBe(false);
    }
  );

  it.each([Role.TECHNICIAN, Role.SITE_MANAGER])(
    'allows %s in the technician area',
    (role) => {
      expect(
        isRoleAllowedForPath(role, '/dashboard/technician/derivations')
      ).toBe(true);
    }
  );

  it.each([Role.ADMIN, Role.SUPERVISOR])(
    'denies %s in the technician area',
    (role) => {
      expect(isRoleAllowedForPath(role, '/dashboard/technician/urgences')).toBe(
        false
      );
    }
  );

  it.each(Object.values(Role))('allows %s on shared pages', (role) => {
    expect(isRoleAllowedForPath(role, '/dashboard')).toBe(true);
    expect(isRoleAllowedForPath(role, '/dashboard/profile')).toBe(true);
  });

  it('does not treat a lookalike prefix as a restricted area', () => {
    expect(
      isRoleAllowedForPath(Role.TECHNICIAN, '/dashboard/administration')
    ).toBe(true);
  });
});
