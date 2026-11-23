import { describe, it, expect } from 'vitest';
import { Role } from '@repo/types';
import {
  getActiveHref,
  getNavigationLinks,
  getVisibleAdminLinks,
  isLinkActive,
} from './navbar-links';

describe('getVisibleAdminLinks', () => {
  it('shows every admin section to an admin', () => {
    const labels = getVisibleAdminLinks(Role.ADMIN).map((link) => link.label);
    expect(labels).toEqual([
      'Utilisateurs',
      'Techniciens',
      'Relevés de dérivation',
      'Chantiers',
    ]);
  });

  it('shows user, team, derivation and chantier management to a supervisor', () => {
    const labels = getVisibleAdminLinks(Role.SUPERVISOR).map(
      (link) => link.label
    );
    expect(labels).toEqual([
      'Utilisateurs',
      'Techniciens',
      'Relevés de dérivation',
      'Chantiers',
    ]);
  });

  it('shows nothing to a technician', () => {
    expect(getVisibleAdminLinks(Role.TECHNICIAN)).toEqual([]);
  });
});

describe('getNavigationLinks', () => {
  it('starts with the dashboard link for every role', () => {
    for (const role of Object.values(Role)) {
      expect(getNavigationLinks(role)[0]?.href).toBe('/dashboard');
    }
  });

  it('gives a supervisor the admin sections without technician ones', () => {
    const labels = getNavigationLinks(Role.SUPERVISOR).map((l) => l.label);
    expect(labels).toEqual([
      'Tableau de bord',
      'Utilisateurs',
      'Techniciens',
      'Relevés de dérivation',
      'Chantiers',
    ]);
  });

  it('gives a technician only their own sections', () => {
    const labels = getNavigationLinks(Role.TECHNICIAN).map((l) => l.label);
    expect(labels).toEqual(['Tableau de bord', 'Chantiers', 'Mon espace']);
  });
});

describe('isLinkActive', () => {
  const page = (href: string) => ({ label: href, href, type: 'page' as const });

  it('matches the dashboard link only on the exact path', () => {
    expect(isLinkActive('/dashboard', page('/dashboard'))).toBe(true);
    expect(isLinkActive('/dashboard/admin/users', page('/dashboard'))).toBe(
      false
    );
  });

  it('matches a page on its own path and nested paths', () => {
    const link = page('/dashboard/admin/chantiers');
    expect(isLinkActive('/dashboard/admin/chantiers', link)).toBe(true);
    expect(isLinkActive('/dashboard/admin/chantiers/42', link)).toBe(true);
  });

  it('does not match a sibling path sharing the same prefix', () => {
    expect(
      isLinkActive('/dashboard/admin/chantiers-old', page('/dashboard/admin/chantiers'))
    ).toBe(false);
  });

  it('marks a folder active when one of its pages is active', () => {
    const folder = {
      label: 'Chantiers',
      href: '#',
      type: 'folder' as const,
      pages: [page('/dashboard/admin/chantiers')],
    };
    expect(isLinkActive('/dashboard/admin/chantiers/7', folder)).toBe(true);
    expect(isLinkActive('/dashboard/admin/users', folder)).toBe(false);
  });
});

describe('getActiveHref', () => {
  it('picks the most specific page when several match', () => {
    const links = getNavigationLinks(Role.TECHNICIAN);
    expect(
      getActiveHref('/dashboard/technician/derivations/complete', links)
    ).toBe('/dashboard/technician/derivations/complete');
  });

  it('returns undefined when no page matches', () => {
    expect(
      getActiveHref('/somewhere/else', getNavigationLinks(Role.ADMIN))
    ).toBeUndefined();
  });
});
