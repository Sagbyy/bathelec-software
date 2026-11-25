import { describe, it, expect } from 'vitest';
import { getReportPhotoFileError } from './report-photo';

const MEGABYTE = 1024 * 1024;

const fileOf = (type: string, size: number) =>
  new File([new Uint8Array(size)], 'photo', { type });

describe('getReportPhotoFileError', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'])(
    'accepts a %s photo up to 5 MB',
    (type) => {
      expect(getReportPhotoFileError(fileOf(type, 5 * MEGABYTE))).toBeNull();
    }
  );

  it.each(['image/gif', 'image/heic', 'application/pdf', ''])(
    'rejects the %p format',
    (type) => {
      expect(getReportPhotoFileError(fileOf(type, 10))).toMatch(
        /JPEG, PNG ou WebP/
      );
    }
  );

  it('rejects a photo above 5 MB', () => {
    expect(
      getReportPhotoFileError(fileOf('image/jpeg', 5 * MEGABYTE + 1))
    ).toMatch(/5 Mo/);
  });
});
