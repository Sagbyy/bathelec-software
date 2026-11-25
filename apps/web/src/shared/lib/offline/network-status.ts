import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
};

export const isBrowserOnline = () =>
  typeof navigator === 'undefined' ? true : navigator.onLine;

export const useNetworkStatus = () =>
  useSyncExternalStore(subscribe, isBrowserOnline, () => true);
