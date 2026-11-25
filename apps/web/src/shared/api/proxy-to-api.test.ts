// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildUpstreamUrl, proxyToApi } from './proxy-to-api';

const API = 'http://api.test';

const mockUpstream = (response: Response) =>
  vi.spyOn(global, 'fetch').mockResolvedValue(response);

const upstreamCall = (spy: ReturnType<typeof mockUpstream>) => {
  const [url, init] = spy.mock.calls[0] ?? [];
  return { url, init: init as RequestInit & { headers: Headers } };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildUpstreamUrl', () => {
  it('joins the base url, encoded path segments and query string', () => {
    expect(
      buildUpstreamUrl('http://api.test/', ['users', 'a b'], '?page=2')
    ).toBe('http://api.test/users/a%20b?page=2');
  });

  it('prevents path segments from escaping their position', () => {
    expect(buildUpstreamUrl(API, ['users', '../admin'], '')).toBe(
      'http://api.test/users/..%2Fadmin'
    );
  });
});

describe('proxyToApi', () => {
  it('forwards the session token as a bearer header and drops cookies', async () => {
    const spy = mockUpstream(new Response('{}', { status: 200 }));
    const request = new Request('http://web.test/api/backend/users/me', {
      headers: { cookie: 'token=abc; other=1', authorization: 'Bearer spoof' },
    });

    await proxyToApi(request, {
      apiBaseUrl: API,
      pathSegments: ['users', 'me'],
      token: 'abc',
    });

    const { url, init } = upstreamCall(spy);
    expect(url).toBe('http://api.test/users/me');
    expect(init.headers.get('authorization')).toBe('Bearer abc');
    expect(init.headers.get('cookie')).toBeNull();
    expect(init.body).toBeUndefined();
  });

  it('does not send an authorization header without a session', async () => {
    const spy = mockUpstream(new Response(null, { status: 401 }));
    const request = new Request('http://web.test/api/backend/users/me', {
      headers: { authorization: 'Bearer spoof' },
    });

    const response = await proxyToApi(request, {
      apiBaseUrl: API,
      pathSegments: ['users', 'me'],
      token: undefined,
    });

    expect(upstreamCall(spy).init.headers.has('authorization')).toBe(false);
    expect(response.status).toBe(401);
  });

  it('forwards the method, body and query string', async () => {
    const spy = mockUpstream(new Response(null, { status: 201 }));
    const request = new Request('http://web.test/api/backend/derivations?x=1', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ folio: 'A' }),
    });

    await proxyToApi(request, {
      apiBaseUrl: API,
      pathSegments: ['derivations'],
      token: 'abc',
    });

    const { url, init } = upstreamCall(spy);
    expect(url).toBe('http://api.test/derivations?x=1');
    expect(init.method).toBe('POST');
    expect(init.headers.get('content-type')).toBe('application/json');
    expect(new TextDecoder().decode(init.body as ArrayBuffer)).toBe(
      '{"folio":"A"}'
    );
  });

  it('relays the upstream status, headers and body', async () => {
    mockUpstream(
      new Response('file-content', {
        status: 200,
        headers: {
          'content-type': 'application/octet-stream',
          'content-disposition': 'attachment; filename="export.xlsx"',
        },
      })
    );

    const response = await proxyToApi(
      new Request('http://web.test/api/backend/export'),
      { apiBaseUrl: API, pathSegments: ['export'], token: 'abc' }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="export.xlsx"'
    );
    await expect(response.text()).resolves.toBe('file-content');
  });
});
