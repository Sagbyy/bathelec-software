import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGIN = 'https://app.example.test';
const script = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');

type Listener = (event: Record<string, unknown>) => void;

interface FakeRequest {
  url: string;
  method: string;
  mode: string;
  headers: Headers;
}

const keyOf = (request: FakeRequest | string) =>
  new URL(typeof request === 'string' ? request : request.url, ORIGIN).href;

const createCaches = () => {
  const stores = new Map<string, Map<string, Response>>();
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name)!;
    return {
      put: async (request: FakeRequest, response: Response) => {
        store.set(keyOf(request), response);
      },
    };
  };
  return {
    stores,
    api: {
      open,
      keys: async () => Array.from(stores.keys()),
      delete: async (name: string) => stores.delete(name),
      match: async (request: FakeRequest | string) => {
        for (const store of stores.values()) {
          const hit = store.get(keyOf(request));
          if (hit) return hit.clone();
        }
        return undefined;
      },
    },
  };
};

const pageResponse = (
  body: string,
  { redirected = false, status = 200 } = {}
) => {
  const response = new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html' },
  });
  Object.defineProperty(response, 'type', { value: 'basic' });
  Object.defineProperty(response, 'redirected', { value: redirected });
  return response;
};

const request = (
  path: string,
  { mode = 'navigate', method = 'GET', headers = {} } = {}
): FakeRequest => ({
  url: new URL(path, ORIGIN).href,
  method,
  mode,
  headers: new Headers(headers),
});

const loadWorker = () => {
  const listeners = new Map<string, Listener>();
  const caches = createCaches();
  const fetchMock = vi.fn<(request: FakeRequest | string) => Promise<Response>>();
  const self = {
    location: new URL(ORIGIN),
    addEventListener: (type: string, listener: Listener) =>
      listeners.set(type, listener),
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn().mockResolvedValue(undefined) },
  };
  class WorkerRequest {
    url: string;
    method = 'GET';
    mode = 'cors';
    headers = new Headers();
    constructor(url: string) {
      this.url = new URL(url, ORIGIN).href;
    }
  }

  new Function('self', 'caches', 'fetch', 'Request', 'Response', script)(
    self,
    caches.api,
    fetchMock,
    WorkerRequest,
    Response
  );

  const dispatchFetch = async (fetchRequest: FakeRequest) => {
    let responded: Promise<Response> | undefined;
    listeners.get('fetch')!({
      request: fetchRequest,
      respondWith: (response: Promise<Response>) => {
        responded = response;
      },
    });
    return responded ? await responded : undefined;
  };

  const dispatchWithEvent = async (
    type: string,
    data?: unknown,
    origin: string = ORIGIN
  ) => {
    let pending: Promise<unknown> = Promise.resolve();
    listeners.get(type)!({
      data,
      origin,
      waitUntil: (promise: Promise<unknown>) => {
        pending = promise;
      },
    });
    await pending;
  };

  return { caches, fetchMock, dispatchFetch, dispatchWithEvent };
};

describe('service worker (ENF-08)', () => {
  let worker: ReturnType<typeof loadWorker>;

  beforeEach(() => {
    worker = loadWorker();
  });

  it.each([
    ['an API call through the Next proxy', request('/api/backend/derivations/me', { mode: 'cors' })],
    ['a cross-origin API call', { ...request('/x'), url: 'https://api.example.test/derivations/me', mode: 'cors' }],
    ['a POST submission', request('/dashboard/technician', { method: 'POST' })],
    ['an office page', request('/dashboard/admin/users')],
  ])('never intercepts %s', async (_, fetchRequest) => {
    expect(await worker.dispatchFetch(fetchRequest)).toBeUndefined();
  });

  it('serves static assets from the cache first', async () => {
    worker.fetchMock.mockResolvedValueOnce(pageResponse('console.log(1)'));
    const asset = request('/_next/static/chunks/app.js', { mode: 'no-cors' });

    await worker.dispatchFetch(asset);
    const second = await worker.dispatchFetch(asset);

    expect(worker.fetchMock).toHaveBeenCalledTimes(1);
    expect(await second!.text()).toBe('console.log(1)');
  });

  it('refreshes technician pages from the network and caches them', async () => {
    worker.fetchMock.mockResolvedValueOnce(pageResponse('<html>live</html>'));

    const response = await worker.dispatchFetch(
      request('/dashboard/technician/derivations')
    );

    expect(await response!.text()).toBe('<html>live</html>');
    expect(
      worker.caches.stores
        .get('bathelec-pages-v1')
        ?.has(`${ORIGIN}/dashboard/technician/derivations`)
    ).toBe(true);
  });

  it('falls back to the cached technician page when the network is down', async () => {
    worker.fetchMock.mockResolvedValueOnce(pageResponse('<html>cached</html>'));
    await worker.dispatchFetch(request('/dashboard'));
    worker.fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const response = await worker.dispatchFetch(request('/dashboard'));

    expect(await response!.text()).toBe('<html>cached</html>');
  });

  it('shows an offline page for a technician page never visited', async () => {
    worker.fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const response = await worker.dispatchFetch(
      request('/dashboard/technician/derivations/complete/99')
    );

    expect(response!.status).toBe(503);
    expect(await response!.text()).toContain('Vous êtes hors ligne');
  });

  it('does not cache a redirect to the login page', async () => {
    worker.fetchMock.mockResolvedValueOnce(
      pageResponse('<html>login</html>', { redirected: true })
    );

    await worker.dispatchFetch(request('/dashboard'));

    expect(worker.caches.stores.get('bathelec-pages-v1')?.size ?? 0).toBe(0);
  });

  it('warms assigned report pages and the assets they reference', async () => {
    worker.fetchMock.mockImplementation(async (target) => {
      const url = keyOf(target as FakeRequest);
      return pageResponse(
        url.endsWith('/complete/12')
          ? '<script src="/_next/static/chunks/form.js"></script>'
          : 'asset'
      );
    });

    await worker.dispatchWithEvent('message', {
      type: 'WARM_PAGES',
      urls: ['/dashboard/technician/derivations/complete/12', '/dashboard/admin'],
    });

    const pages = worker.caches.stores.get('bathelec-pages-v1');
    expect(pages?.has(`${ORIGIN}/dashboard/technician/derivations/complete/12`)).toBe(true);
    expect(pages?.has(`${ORIGIN}/dashboard/admin`)).toBe(false);
    expect(
      worker.caches.stores
        .get('bathelec-static-v1')
        ?.has(`${ORIGIN}/_next/static/chunks/form.js`)
    ).toBe(true);
  });

  it('ignores warm-up messages from another origin', async () => {
    await worker.dispatchWithEvent(
      'message',
      { type: 'WARM_PAGES', urls: ['/dashboard'] },
      'https://evil.example.test'
    );

    expect(worker.fetchMock).not.toHaveBeenCalled();
  });

  it('drops caches from previous versions on activation', async () => {
    await worker.caches.api.open('bathelec-pages-v0');
    await worker.caches.api.open('bathelec-static-v1');

    await worker.dispatchWithEvent('activate');

    expect(await worker.caches.api.keys()).toEqual(['bathelec-static-v1']);
  });
});
