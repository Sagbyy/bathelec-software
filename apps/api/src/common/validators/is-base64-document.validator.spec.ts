import { IsBase64DocumentConstraint } from './is-base64-document.validator';
import { decodedByteLength } from './base64-file';

describe('decodedByteLength', () => {
  it.each([
    ['QUJD', 3],
    ['QUI=', 2],
    ['QQ==', 1],
  ])('decodes %s to %i bytes (padding aware)', (data, expected) => {
    expect(decodedByteLength(data as string)).toBe(expected);
  });
});

describe('IsBase64DocumentConstraint', () => {
  const validator = new IsBase64DocumentConstraint();

  it.each([
    'data:application/pdf;base64,JVBERi0xLjQ=',
    'data:image/jpeg;base64,/9j/4AAQSkZJRgAB',
    'data:image/png;base64,iVBORw0KGgo=',
    'data:image/webp;base64,UklGRlYAAABXRUJQ',
  ])('accepts an allowed file type: %s', (value) => {
    expect(validator.validate(value)).toBe(true);
  });

  it.each([
    ['svg (xss)', 'data:image/svg+xml;base64,PHN2Zy8+'],
    ['html (xss)', 'data:text/html;base64,PHNjcmlwdD4='],
    ['octet-stream', 'data:application/octet-stream;base64,TVqQAAM='],
  ])('rejects a disallowed file type: %s', (_label, value) => {
    expect(validator.validate(value as string)).toBe(false);
  });

  it.each([
    ['plain string', 'not-a-document'],
    ['empty string', ''],
    ['missing base64 marker', 'data:application/pdf,JVBERi0='],
    ['invalid base64 chars', 'data:application/pdf;base64,!!!!'],
  ])('rejects an invalid payload: %s', (_label, value) => {
    expect(validator.validate(value as string)).toBe(false);
  });

  it('rejects a non-string value', () => {
    expect(validator.validate(null as unknown as string)).toBe(false);
    expect(validator.validate(42 as unknown as string)).toBe(false);
  });

  it('rejects a file whose decoded size exceeds 10MB', () => {
    expect(
      validator.validate(
        'data:application/pdf;base64,' + 'A'.repeat(14 * 1024 * 1024)
      )
    ).toBe(false);
  });

  it('accepts a file whose decoded size stays within 10MB', () => {
    expect(
      validator.validate('data:application/pdf;base64,' + 'A'.repeat(100))
    ).toBe(true);
  });

  it('exposes a descriptive error message', () => {
    expect(validator.defaultMessage()).toContain('10MB');
    expect(validator.defaultMessage()).toContain('PDF');
  });
});
