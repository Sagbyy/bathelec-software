import { describe, expect, it } from 'vitest';
import { pickReportSource } from './report-source';

const draftSavedAt = (savedAt: number) => ({
  values: {},
  step: 4,
  savedAt,
});

describe('pickReportSource (ENF-08)', () => {
  it('uses the server report when there is no local draft', () => {
    expect(
      pickReportSource(undefined, { updatedAt: '2026-01-01T10:00:00.000Z' })
    ).toBe('server');
  });

  it('uses the local draft when the server has no report yet', () => {
    expect(pickReportSource(draftSavedAt(1), null)).toBe('draft');
  });

  it('keeps the field data when the draft is newer than the server report', () => {
    expect(
      pickReportSource(draftSavedAt(Date.parse('2026-01-02T00:00:00.000Z')), {
        updatedAt: '2026-01-01T00:00:00.000Z',
      })
    ).toBe('draft');
  });

  it('uses the server report when it was updated after the draft', () => {
    expect(
      pickReportSource(draftSavedAt(Date.parse('2026-01-01T00:00:00.000Z')), {
        updatedAt: '2026-01-02T00:00:00.000Z',
      })
    ).toBe('server');
  });

  it('falls back to the creation date, then to the draft when undated', () => {
    expect(
      pickReportSource(draftSavedAt(0), {
        createdAt: '2026-01-02T00:00:00.000Z',
      })
    ).toBe('server');
    expect(pickReportSource(draftSavedAt(0), {})).toBe('draft');
  });
});
