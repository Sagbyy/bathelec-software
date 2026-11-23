import { describe, expect, it } from 'vitest';
import { getInitials } from './get-initials';

describe('getInitials', () => {
  it('uses the first letter of first and last name', () => {
    expect(getInitials('Jean', 'Dupont')).toBe('JD');
  });

  it('splits a dotted username into words', () => {
    expect(getInitials('jean.dupont')).toBe('JD');
  });

  it('uses the first two letters of a single word', () => {
    expect(getInitials('admin')).toBe('AD');
  });

  it('ignores missing and blank parts', () => {
    expect(getInitials(undefined, '  ', 'Marie')).toBe('MA');
  });

  it('falls back to a question mark when nothing is provided', () => {
    expect(getInitials(undefined, null, '')).toBe('?');
  });
});
