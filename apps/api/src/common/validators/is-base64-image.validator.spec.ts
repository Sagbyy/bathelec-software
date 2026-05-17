import { IsBase64ImageConstraint } from './is-base64-image.validator';

describe('IsBase64ImageConstraint', () => {
  let validator: IsBase64ImageConstraint;

  const validJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgAB';
  const validPng = 'data:image/png;base64,iVBORw0KGgo=';
  const validWebp = 'data:image/webp;base64,UklGRlYAAABXRUJQ';

  beforeEach(() => {
    validator = new IsBase64ImageConstraint();
  });

  describe('formats valides', () => {
    it('should accept a valid jpeg', () => {
      expect(validator.validate(validJpeg)).toBe(true);
    });

    it('should accept a valid png', () => {
      expect(validator.validate(validPng)).toBe(true);
    });

    it('should accept a valid webp', () => {
      expect(validator.validate(validWebp)).toBe(true);
    });
  });

  describe('types de fichiers interdits', () => {
    it('should reject SVG (vecteur XSS)', () => {
      expect(
        validator.validate(
          'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9ImFsZXJ0KDEpIi8+'
        )
      ).toBe(false);
    });

    it('should reject PDF', () => {
      expect(
        validator.validate('data:application/pdf;base64,JVBERi0xLjQ=')
      ).toBe(false);
    });

    it('should reject executables (application/octet-stream)', () => {
      expect(
        validator.validate('data:application/octet-stream;base64,TVqQAAMAAAA=')
      ).toBe(false);
    });

    it('should reject JavaScript', () => {
      expect(
        validator.validate('data:text/javascript;base64,YWxlcnQoMSk=')
      ).toBe(false);
    });

    it('should reject HTML (vecteur XSS)', () => {
      expect(
        validator.validate(
          'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='
        )
      ).toBe(false);
    });
  });

  describe('format invalide', () => {
    it('should reject a plain string', () => {
      expect(validator.validate('not-an-image')).toBe(false);
    });

    it('should reject missing base64 prefix', () => {
      expect(validator.validate('data:image/jpeg,/9j/4AAQ')).toBe(false);
    });

    it('should reject invalid base64 characters', () => {
      expect(validator.validate('data:image/jpeg;base64,!!!invalid!!!')).toBe(
        false
      );
    });

    it('should reject empty string', () => {
      expect(validator.validate('')).toBe(false);
    });

    it('should reject non-string value', () => {
      expect(validator.validate(null as any)).toBe(false);
      expect(validator.validate(123 as any)).toBe(false);
    });
  });

  describe('protection DoS (taille)', () => {
    it('should reject a base64 string exceeding 5MB', () => {
      const oversized =
        'data:image/jpeg;base64,' + 'A'.repeat(5 * 1024 * 1024 + 1);
      expect(validator.validate(oversized)).toBe(false);
    });

    it('should accept a base64 string within the 5MB limit', () => {
      const withinLimit = 'data:image/jpeg;base64,' + 'A'.repeat(100);
      expect(validator.validate(withinLimit)).toBe(true);
    });
  });

  describe("message d'erreur", () => {
    it('should return a descriptive error message', () => {
      expect(validator.defaultMessage()).toContain('5MB');
      expect(validator.defaultMessage()).toContain('base64');
    });
  });
});
