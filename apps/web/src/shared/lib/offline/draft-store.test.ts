import { describe, expect, it } from 'vitest';
import { createDraftStore } from './draft-store';

describe('createDraftStore', () => {
  const drafts = createDraftStore<{ name: string; photo: string }>(
    'draft-store-test',
    () => 42
  );

  it('saves and restores a draft with its step and timestamp', async () => {
    await drafts.save(1, 10, {
      values: { name: 'M. DUPONT', photo: 'data:image/jpeg;base64,abc' },
      step: 3,
    });

    expect(await drafts.load(1, 10)).toEqual({
      values: { name: 'M. DUPONT', photo: 'data:image/jpeg;base64,abc' },
      step: 3,
      savedAt: 42,
    });
  });

  it('scopes drafts per user and derivation', async () => {
    await drafts.save(1, 20, { values: { name: 'A', photo: '' }, step: 1 });

    expect(await drafts.load(2, 20)).toBeUndefined();
    expect(await drafts.load(1, 21)).toBeUndefined();
  });

  it('clears a draft', async () => {
    await drafts.save(1, 30, { values: { name: 'A', photo: '' }, step: 1 });
    await drafts.clear(1, 30);

    expect(await drafts.load(1, 30)).toBeUndefined();
  });
});
