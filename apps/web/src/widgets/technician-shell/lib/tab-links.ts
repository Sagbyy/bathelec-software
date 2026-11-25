import type { LucideIcon } from 'lucide-react';
import { FileText, HardHat, House, PhoneCall, UserRound } from 'lucide-react';

export interface TabLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const HOME_HREF = '/dashboard';

export const tabLinks: TabLink[] = [
  { label: 'Accueil', href: HOME_HREF, icon: House },
  { label: 'Chantiers', href: '/dashboard/technician/derivations', icon: HardHat },
  { label: 'Documents', href: '/dashboard/technician/documents', icon: FileText },
  { label: 'Urgences', href: '/dashboard/technician/urgences', icon: PhoneCall },
  { label: 'Profil', href: '/dashboard/profile', icon: UserRound },
];

export const OFFLINE_SHELL_PATHS: readonly string[] = [
  ...tabLinks.map((tab) => tab.href),
  '/dashboard/technician/derivations/complete',
  '/dashboard/technician/assignments',
];

const matches = (pathname: string, href: string) =>
  href === HOME_HREF
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

export function getActiveTabHref(pathname: string): string | undefined {
  return tabLinks
    .filter((tab) => matches(pathname, tab.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
