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

    it('redirects /dashboard/technician/top-chantiers to /auth', () => {
      const response = middleware(
        createRequest('/dashboard/technician/top-chantiers')
      );

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/auth');
    });

    it('redirects /dashboard/technician/documents to /auth', () => {
      const response = middleware(
        createRequest('/dashboard/technician/documents')
      );

      expect(response.status).toBe(307);
    });

    it('redirects /dashboard/technician/habilitations to /auth', () => {
      const response = middleware(
        createRequest('/dashboard/technician/habilitations')
      );

      expect(response.status).toBe(307);
    });

    it('redirects /dashboard/technician/vehicule to /auth', () => {
      const response = middleware(
        createRequest('/dashboard/technician/vehicule')
      );

      expect(response.status).toBe(307);
    });

    it('redirects /dashboard/technician/urgences to /auth', () => {
      const response = middleware(
        createRequest('/dashboard/technician/urgences')
      );

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

    it('allows access to /dashboard/technician/top-chantiers with token', () => {
      const response = middleware(
        createRequest('/dashboard/technician/top-chantiers', 'valid-token')
      );

      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /dashboard/technician/urgences with token', () => {
      const response = middleware(
        createRequest('/dashboard/technician/urgences', 'valid-token')
      );

      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /dashboard/technician/documents with token', () => {
      const response = middleware(
        createRequest('/dashboard/technician/documents', 'valid-token')
      );

      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /dashboard/technician/habilitations with token', () => {
      const response = middleware(
        createRequest('/dashboard/technician/habilitations', 'valid-token')
      );

      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /dashboard/technician/vehicule with token', () => {
      const response = middleware(
        createRequest('/dashboard/technician/vehicule', 'valid-token')
      );

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
