// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { SignJWT } from 'jose';
import { Role } from '@repo/types';
import { middleware } from './middleware';

const SECRET = 'middleware-test-secret';

const signToken = (role: string, secret = SECRET) =>
  new SignJWT({ userId: 1, username: 'user', role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(secret));

function createRequest(pathname: string, token?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (token) headers['Cookie'] = `token=${token}`;
  return new NextRequest(`http://localhost:3000${pathname}`, { headers });
}

const locationOf = (response: Response) =>
  response.headers.get('location') ?? '';

const pathnameOf = (response: Response) =>
  new URL(locationOf(response)).pathname;

let previousSecret: string | undefined;

beforeAll(() => {
  previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = SECRET;
});

afterAll(() => {
  process.env.JWT_SECRET = previousSecret;
});

describe('middleware', () => {
  describe('protected routes without a valid session', () => {
    it.each([
      '/dashboard',
      '/profile',
      '/dashboard/admin/users',
      '/dashboard/technician/top-chantiers',
      '/dashboard/technician/documents',
      '/dashboard/technician/habilitations',
      '/dashboard/technician/vehicule',
      '/dashboard/technician/urgences',
    ])('redirects %s to the login page with a callbackUrl', async (path) => {
      const response = await middleware(createRequest(path));

      expect(response.status).toBe(307);
      expect(pathnameOf(response)).toBe('/auth');
      expect(new URL(locationOf(response)).searchParams.get('callbackUrl')).toBe(
        path
      );
    });

    it('redirects to login when the token is not a valid JWT', async () => {
      const response = await middleware(
        createRequest('/dashboard', 'forged-token')
      );

      expect(pathnameOf(response)).toBe('/auth');
      expect(response.headers.get('set-cookie')).toContain('token=;');
    });

    it('redirects to login when the token is signed with another secret', async () => {
      const token = await signToken(Role.ADMIN, 'attacker-secret');

      const response = await middleware(createRequest('/dashboard', token));

      expect(pathnameOf(response)).toBe('/auth');
    });

    it('redirects to login when the server has no JWT secret', async () => {
      const token = await signToken(Role.ADMIN);
      process.env.JWT_SECRET = '';

      const response = await middleware(createRequest('/dashboard', token));
      process.env.JWT_SECRET = SECRET;

      expect(pathnameOf(response)).toBe('/auth');
    });
  });

  describe('role-based access', () => {
    it.each([
      [Role.ADMIN, '/dashboard/admin/users'],
      [Role.SUPERVISOR, '/dashboard/admin/site-teams'],
      [Role.TECHNICIAN, '/dashboard/technician/urgences'],
      [Role.SITE_MANAGER, '/dashboard/technician/derivations'],
      [Role.ADMIN, '/dashboard'],
      [Role.TECHNICIAN, '/dashboard'],
      [Role.TECHNICIAN, '/dashboard/profile'],
    ])('lets %s access %s', async (role, path) => {
      const response = await middleware(
        createRequest(path, await signToken(role))
      );

      expect(response.headers.get('location')).toBeNull();
    });

    it.each([
      [Role.TECHNICIAN, '/dashboard/admin/users'],
      [Role.SITE_MANAGER, '/dashboard/admin/chantiers'],
      [Role.ADMIN, '/dashboard/technician/derivations'],
      [Role.SUPERVISOR, '/dashboard/technician/documents'],
    ])('redirects %s away from %s to the dashboard', async (role, path) => {
      const response = await middleware(
        createRequest(path, await signToken(role))
      );

      expect(response.status).toBe(307);
      expect(pathnameOf(response)).toBe('/dashboard');
    });
  });

  describe('/auth route', () => {
    it('redirects to /dashboard when the session is valid', async () => {
      const response = await middleware(
        createRequest('/auth', await signToken(Role.TECHNICIAN))
      );

      expect(response.status).toBe(307);
      expect(pathnameOf(response)).toBe('/dashboard');
    });

    it('allows access to /auth without token', async () => {
      const response = await middleware(createRequest('/auth'));

      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /auth and clears an invalid token', async () => {
      const response = await middleware(createRequest('/auth', 'stale-token'));

      expect(response.headers.get('location')).toBeNull();
      expect(response.headers.get('set-cookie')).toContain('token=;');
    });
  });
});
