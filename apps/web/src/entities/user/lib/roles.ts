import { MANAGEMENT_ROLES } from '@repo/types';

export function isManagementRole(role: string): boolean {
  return (MANAGEMENT_ROLES as readonly string[]).includes(role);
}
