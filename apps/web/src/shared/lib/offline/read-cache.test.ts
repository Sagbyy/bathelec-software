import { describe, expect, it } from 'vitest';
import { Role } from '@repo/types';
import { shouldPersistQuery, shouldPersistSuccessfulQuery } from './read-cache';

describe('shouldPersistQuery', () => {
  it.each([
    [['user']],
    [['derivations', 'me']],
    [['derivation', 12]],
    [['completed-derivations', 12]],
    [['chantiers', 'ongoing']],
    [['markets']],
    [['site-teams', 'mine']],
  ])('persists the technician data %j', (queryKey) => {
    expect(shouldPersistQuery(queryKey, Role.TECHNICIAN)).toBe(true);
    expect(shouldPersistQuery(queryKey, Role.SITE_MANAGER)).toBe(true);
  });

  it.each([[['official-documents', 1]], [['habilitations', 1]], [['users']]])(
    'never persists personal documents or other users data %j',
    (queryKey) => {
      expect(shouldPersistQuery(queryKey, Role.TECHNICIAN)).toBe(false);
    }
  );

  it.each([Role.ADMIN, Role.SUPERVISOR, undefined])(
    'persists nothing for the office role %s',
    (role) => {
      expect(shouldPersistQuery(['derivations'], role)).toBe(false);
      expect(shouldPersistQuery(['user'], role)).toBe(false);
    }
  );
});

describe('shouldPersistSuccessfulQuery', () => {
  it('skips failed queries', () => {
    expect(
      shouldPersistSuccessfulQuery(
        {
          queryKey: ['derivations', 'me'],
          state: { status: 'error' } as never,
        },
        Role.TECHNICIAN
      )
    ).toBe(false);
  });

  it('keeps successful technician queries', () => {
    expect(
      shouldPersistSuccessfulQuery(
        {
          queryKey: ['derivations', 'me'],
          state: { status: 'success' } as never,
        },
        Role.TECHNICIAN
      )
    ).toBe(true);
  });
});
