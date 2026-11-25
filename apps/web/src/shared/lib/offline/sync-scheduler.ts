export const SYNC_INTERVAL_MS = 30_000;

type SyncRun = (options: { force: boolean }) => Promise<unknown>;

export const startBackgroundSync = (
  run: SyncRun,
  intervalMs: number = SYNC_INTERVAL_MS
) => {
  const safeRun = (force: boolean) => {
    run({ force }).catch(() => undefined);
  };
  const onOnline = () => safeRun(true);
  const onVisible = () => {
    if (document.visibilityState === 'visible') {
      safeRun(false);
    }
  };

  window.addEventListener('online', onOnline);
  document.addEventListener('visibilitychange', onVisible);
  const timer = window.setInterval(() => safeRun(false), intervalMs);
  safeRun(true);

  return () => {
    window.removeEventListener('online', onOnline);
    document.removeEventListener('visibilitychange', onVisible);
    window.clearInterval(timer);
  };
};
