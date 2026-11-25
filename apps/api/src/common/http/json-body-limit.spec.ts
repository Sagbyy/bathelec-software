import { REPORT_PHOTO_MAX_BYTES } from '@repo/types';
import { JSON_BODY_LIMIT_BYTES, MAX_REPORT_PHOTOS } from './json-body-limit';

const MEGABYTE = 1024 * 1024;

describe('JSON_BODY_LIMIT_BYTES', () => {
  it('counts the four mandatory photos and the two additional ones', () => {
    expect(MAX_REPORT_PHOTOS).toBe(6);
  });

  it('fits a report whose six photos all reach the size cap once base64 encoded', () => {
    const encodedPhotos = Math.ceil(
      (MAX_REPORT_PHOTOS * REPORT_PHOTO_MAX_BYTES * 4) / 3
    );

    expect(JSON_BODY_LIMIT_BYTES).toBeGreaterThan(encodedPhotos);
  });

  it('fits the largest chantier document (10 MB once base64 encoded)', () => {
    expect(JSON_BODY_LIMIT_BYTES).toBeGreaterThan((10 * MEGABYTE * 4) / 3);
  });

  it('stays far below the former 100 MB limit', () => {
    expect(JSON_BODY_LIMIT_BYTES).toBe(45 * MEGABYTE);
  });
});
