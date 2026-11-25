const CACHE_VERSION = 'v1';
const STATIC_CACHE = `bathelec-static-${CACHE_VERSION}`;
const PAGES_CACHE = `bathelec-pages-${CACHE_VERSION}`;
const CURRENT_CACHES = new Set([STATIC_CACHE, PAGES_CACHE]);
const NETWORK_TIMEOUT_MS = 4000;
const MAX_WARMED_PAGES = 60;
const STATIC_PATH_PREFIXES = ['/_next/static/', '/images/', '/fonts/'];
const STATIC_FILES = new Set(['/favicon.ico', '/logo-abrisur.webp']);
const ASSET_REFERENCE_PATTERN = /(?:src|href)="(\/_next\/static\/[^"]+)"/g;

const OFFLINE_HTML = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hors ligne · Abrisûr</title></head><body style="font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:1rem;text-align:center"><main><h1 style="font-size:1.25rem">Vous êtes hors ligne</h1><p>Cette page n'a pas encore été enregistrée sur l'appareil. Vos relevés saisis restent enregistrés localement et seront envoyés dès le retour du réseau.</p><p><a href="/dashboard">Retour au tableau de bord</a></p></main></body></html>`;

const isTechnicianPage = (pathname) =>
  pathname === '/dashboard' ||
  pathname.startsWith('/dashboard/technician') ||
  pathname.startsWith('/dashboard/profile');

const isStaticAsset = (pathname) =>
  STATIC_FILES.has(pathname) ||
  STATIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

const isRscRequest = (request) => request.headers.get('RSC') === '1';

const isCacheable = (response) =>
  Boolean(response) &&
  response.ok &&
  !response.redirected &&
  response.type === 'basic';

const putInCache = async (cacheName, request, response) => {
  if (!isCacheable(response)) {
    return;
  }
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  await putInCache(STATIC_CACHE, request, response);
  return response;
};

const offlineResponse = () =>
  new Response(OFFLINE_HTML, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

const networkFirst = async (request) => {
  const network = fetch(request).then(async (response) => {
    await putInCache(PAGES_CACHE, request, response);
    return response;
  });
  network.catch(() => undefined);

  const timeout = new Promise((resolve) =>
    setTimeout(resolve, NETWORK_TIMEOUT_MS)
  );

  try {
    const winner = await Promise.race([network, timeout]);
    if (winner) {
      return winner;
    }
    const cached = await caches.match(request);
    return cached || (await network);
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    if (request.mode === 'navigate') {
      return offlineResponse();
    }
    throw new Error('Network unavailable');
  }
};

const selectStrategy = (request) => {
  if (request.method !== 'GET') {
    return null;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return null;
  }
  if (isStaticAsset(url.pathname)) {
    return cacheFirst;
  }
  if (
    (request.mode === 'navigate' || isRscRequest(request)) &&
    isTechnicianPage(url.pathname)
  ) {
    return networkFirst;
  }
  return null;
};

const cacheAssetIfMissing = async (path) => {
  const request = new Request(path);
  const cached = await caches.match(request);
  if (cached !== undefined) {
    return;
  }
  const response = await fetch(request).catch(() => null);
  await putInCache(STATIC_CACHE, request, response);
};

const cacheReferencedAssets = async (html) => {
  const paths = new Set(
    Array.from(html.matchAll(ASSET_REFERENCE_PATTERN), (match) => match[1])
  );
  await Promise.all(Array.from(paths, cacheAssetIfMissing));
};

const warmPage = async (url) => {
  const target = new URL(url, self.location.origin);
  if (target.origin !== self.location.origin || !isTechnicianPage(target.pathname)) {
    return;
  }
  const request = new Request(target.href, { credentials: 'same-origin' });
  const response = await fetch(request).catch(() => null);
  if (!isCacheable(response)) {
    return;
  }
  await putInCache(PAGES_CACHE, request, response);
  await cacheReferencedAssets(await response.text());
};

const warmPages = (urls) =>
  urls
    .slice(0, MAX_WARMED_PAGES)
    .reduce((previous, url) => previous.then(() => warmPage(url)), Promise.resolve());

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) =>
                name.startsWith('bathelec-') && !CURRENT_CACHES.has(name)
            )
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const strategy = selectStrategy(event.request);
  if (strategy !== null) {
    event.respondWith(strategy(event.request));
  }
});

const isWarmPagesMessage = (event) =>
  event.origin === self.location.origin &&
  event.data?.type === 'WARM_PAGES' &&
  Array.isArray(event.data.urls);

self.addEventListener('message', (event) => {
  if (isWarmPagesMessage(event)) {
    event.waitUntil(warmPages(event.data.urls));
  }
});
