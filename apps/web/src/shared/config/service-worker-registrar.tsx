'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/shared/lib/offline/service-worker';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    registerServiceWorker().catch(() => undefined);
  }, []);

  return null;
}
