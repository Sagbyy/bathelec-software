import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startBackgroundSync } from './sync-scheduler';

describe('startBackgroundSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('replays everything at start', () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const stop = startBackgroundSync(run, 1_000);

    expect(run).toHaveBeenCalledWith({ force: true });
    stop();
  });

  it('retries periodically without forcing pending backoffs', () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const stop = startBackgroundSync(run, 1_000);
    run.mockClear();

    vi.advanceTimersByTime(3_000);

    expect(run).toHaveBeenCalledTimes(3);
    expect(run).toHaveBeenCalledWith({ force: false });
    stop();
  });

  it('replays everything as soon as the network comes back', () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const stop = startBackgroundSync(run, 1_000);
    run.mockClear();

    window.dispatchEvent(new Event('online'));

    expect(run).toHaveBeenCalledWith({ force: true });
    stop();
  });

  it('stops listening once stopped', () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const stop = startBackgroundSync(run, 1_000);
    stop();
    run.mockClear();

    window.dispatchEvent(new Event('online'));
    vi.advanceTimersByTime(5_000);

    expect(run).not.toHaveBeenCalled();
  });

  it('survives a failing replay', () => {
    const run = vi.fn().mockRejectedValue(new Error('IndexedDB indisponible'));

    expect(() => startBackgroundSync(run, 1_000)()).not.toThrow();
  });
});
