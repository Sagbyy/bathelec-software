// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { SignJWT } from 'jose';
import { Role } from '@repo/types';
import { verifySessionToken } from './verify-session-token';

const SECRET = 'test-secret';

const signToken = (
  payload: Record<string, unknown>,
  { secret = SECRET, expiresIn = '1h' } = {}
) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(secret));

describe('verifySessionToken', () => {
  it('returns the session of a valid token', async () => {
    const token = await signToken({
      sub: 7,
      username: 'jdoe',
      role: Role.TECHNICIAN,
    });

    await expect(verifySessionToken(token, SECRET)).resolves.toEqual({
      userId: 7,
      role: Role.TECHNICIAN,
    });
  });

  it('rejects a token signed with another secret', async () => {
    const token = await signToken(
      { sub: 1, role: Role.ADMIN },
      { secret: 'other-secret' }
    );

    await expect(verifySessionToken(token, SECRET)).resolves.toBeNull();
  });

  it('rejects an expired token', async () => {
    const token = await signToken(
      { sub: 1, role: Role.ADMIN },
      { expiresIn: '-1s' }
    );

    await expect(verifySessionToken(token, SECRET)).resolves.toBeNull();
  });

  it('rejects a token with an unknown role', async () => {
    const token = await signToken({ sub: 1, role: 'superuser' });

    await expect(verifySessionToken(token, SECRET)).resolves.toBeNull();
  });

  it('rejects a malformed token', async () => {
    await expect(verifySessionToken('not-a-jwt', SECRET)).resolves.toBeNull();
  });

  it('rejects when the token or the secret is missing', async () => {
    const token = await signToken({ sub: 1, role: Role.ADMIN });

    await expect(verifySessionToken(undefined, SECRET)).resolves.toBeNull();
    await expect(verifySessionToken(token, undefined)).resolves.toBeNull();
  });
});
