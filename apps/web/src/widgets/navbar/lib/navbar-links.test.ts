import { describe, it, expect } from 'vitest';
import { Role } from '@repo/types';
import { getVisibleAdminLinks } from './navbar-links';

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

  it('shows only user and team management to a supervisor', () => {
    const labels = getVisibleAdminLinks(Role.SUPERVISOR).map(
      (link) => link.label
    );
    expect(labels).toEqual(['Utilisateurs', 'Techniciens']);
  });

  it('shows nothing to a technician', () => {
    expect(getVisibleAdminLinks(Role.TECHNICIAN)).toEqual([]);
  });
});
