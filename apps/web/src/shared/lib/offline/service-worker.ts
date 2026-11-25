export const SERVICE_WORKER_URL = '/sw.js';
export const OFFLINE_CACHE_PREFIX = 'bathelec-';
export const WARM_PAGES_MESSAGE = 'WARM_PAGES';

const isServiceWorkerSupported = () =>
  typeof navigator !== 'undefined' && 'serviceWorker' in navigator;

export const registerServiceWorker = async () => {
  if (!isServiceWorkerSupported()) {
    return undefined;
  }
  return navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: '/' });
};

const warmedUrls = new Set<string>();

export const selectUnwarmedUrls = (urls: string[]) =>
  Array.from(new Set(urls)).filter((url) => !warmedUrls.has(url));

export const warmOfflinePages = async (urls: string[]) => {
  if (!isServiceWorkerSupported()) {
    return;
  }
  const pending = selectUnwarmedUrls(urls);
  if (pending.length === 0) {
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  if (!registration.active) {
    return;
  }
  registration.active.postMessage({ type: WARM_PAGES_MESSAGE, urls: pending });
  pending.forEach((url) => warmedUrls.add(url));
};

export const forgetWarmedPages = () => warmedUrls.clear();

export const clearServiceWorkerCaches = async () => {
  forgetWarmedPages();
  if (typeof caches === 'undefined') {
    return;
  }
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((name) => name.startsWith(OFFLINE_CACHE_PREFIX))
      .map((name) => caches.delete(name))
  );
};
