export interface LoginUser {
  username: string;
  password: string;
}

export enum Role {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  SITE_MANAGER = 'site_manager',
  TECHNICIAN = 'technician',
}

export const ROLE_VALUES: Role[] = Object.values(Role) as Role[];

export const ROLE_HIERARCHY: readonly Role[] = [
  Role.ADMIN,
  Role.SUPERVISOR,
  Role.SITE_MANAGER,
  Role.TECHNICIAN,
];

export const MANAGEMENT_ROLES: readonly Role[] = [
  Role.ADMIN,
  Role.SUPERVISOR,
  Role.SITE_MANAGER,
];

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrateur',
  [Role.SUPERVISOR]: 'Encadrant',
  [Role.SITE_MANAGER]: 'Chef de chantier',
  [Role.TECHNICIAN]: 'Technicien',
};

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
}
