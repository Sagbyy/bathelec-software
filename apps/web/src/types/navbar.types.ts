export type NavbarLinkType = 'page' | 'folder';

export interface NavbarLink {
  label: string;
  href: string;
  type: NavbarLinkType;
  description?: string;
  pages?: NavbarLink[];
}