import { Role } from '@repo/types';

export type NavbarLinkType = 'page' | 'folder';

export interface NavbarLink {
  label: string;
  href: string;
  type: NavbarLinkType;
  description?: string;
  pages?: NavbarLink[];
  allowedRoles?: Role[];
}
