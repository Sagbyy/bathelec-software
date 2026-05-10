import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

function createRequest(pathname: string, token?: string): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const headers: Record<string, string> = {};
  if (token) {
    headers['Cookie'] = `token=${token}`;
  }
  return new NextRequest(url, { headers });
}

describe('middleware', () => {
  describe('protected routes without token', () => {
    it('redirects /dashboard to /auth', () => {
      const response = middleware(createRequest('/dashboard'));

      expect(response.status).toBe(307);
      const location = response.headers.get('location') ?? '';
      expect(location).toContain('/auth');
    });

    it('includes callbackUrl in redirect', () => {
      const response = middleware(createRequest('/dashboard'));

      const location = response.headers.get('location') ?? '';
      expect(location).toContain('callbackUrl=');
      expect(decodeURIComponent(location)).toContain('/dashboard');
    });

    it('redirects /profile to /auth', () => {
      const response = middleware(createRequest('/profile'));

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/auth');
    });

    it('redirects /dashboard/admin/users to /auth', () => {
      const response = middleware(createRequest('/dashboard/admin/users'));

      expect(response.status).toBe(307);
    });
  });

  describe('protected routes with valid token', () => {
    it('allows access to /dashboard', () => {
      const response = middleware(createRequest('/dashboard', 'valid-token'));

      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /profile', () => {
      const response = middleware(createRequest('/profile', 'valid-token'));

      expect(response.headers.get('location')).toBeNull();
    });
  });

  describe('/auth route', () => {
    it('redirects to /dashboard when token is present', () => {
      const response = middleware(createRequest('/auth', 'valid-token'));

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/dashboard');
    });

    it('allows access to /auth without token', () => {
      const response = middleware(createRequest('/auth'));

      expect(response.headers.get('location')).toBeNull();
    });
  });
});
