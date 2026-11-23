import { describe, expect, it } from 'vitest';
import { getActiveTabHref } from './tab-links';

describe('getActiveTabHref', () => {
  it('activates home only on the dashboard root', () => {
    expect(getActiveTabHref('/dashboard')).toBe('/dashboard');
  });

  it('activates the chantiers tab on nested derivation pages', () => {
    expect(
      getActiveTabHref('/dashboard/technician/derivations/complete/12')
    ).toBe('/dashboard/technician/derivations');
  });

  it('activates the profile tab on the change password page', () => {
    expect(getActiveTabHref('/dashboard/profile/change-password')).toBe(
      '/dashboard/profile'
    );
  });

  it('activates no tab on pages outside the tab bar', () => {
    expect(getActiveTabHref('/dashboard/technician/vehicule')).toBeUndefined();
  });
});
