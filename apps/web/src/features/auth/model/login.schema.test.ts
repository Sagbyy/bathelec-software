import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(
      loginSchema.safeParse({ username: 'jean.dupont', password: 'secret' })
        .success
    ).toBe(true);
  });

  it('trims the username before validating it', () => {
    const result = loginSchema.safeParse({ username: '  jd  ', password: 'x' });
    expect(result.success && result.data.username).toBe('jd');
  });

  it('rejects a username shorter than 2 characters', () => {
    expect(
      loginSchema.safeParse({ username: 'j', password: 'secret' }).success
    ).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ username: 'jean', password: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Le mot de passe est requis');
  });
});
