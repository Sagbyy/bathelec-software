import { Role } from '@repo/types';

export const SESSION_COOKIE_NAME = 'token';
export const LOGIN_PATH = '/auth';
export const HOME_PATH = '/dashboard';
export const API_PROXY_PATH = '/api/backend';

export const PROTECTED_PATH_PREFIXES = ['/dashboard', '/profile', '/protected'];

export interface RoleRestrictedArea {
  prefix: string;
  allowedRoles: readonly Role[];
}

export const ROLE_RESTRICTED_AREAS: readonly RoleRestrictedArea[] = [
  {
    prefix: '/dashboard/admin',
    allowedRoles: [Role.ADMIN, Role.SUPERVISOR],
  },
  {
    prefix: '/dashboard/technician',
    allowedRoles: [Role.TECHNICIAN, Role.SITE_MANAGER],
  },
];

const matchesPrefix = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some((prefix) =>
    matchesPrefix(pathname, prefix)
  );
}

export function isRoleAllowedForPath(role: Role, pathname: string): boolean {
  return ROLE_RESTRICTED_AREAS.filter((area) =>
    matchesPrefix(pathname, area.prefix)
  ).every((area) => area.allowedRoles.includes(role));
}
