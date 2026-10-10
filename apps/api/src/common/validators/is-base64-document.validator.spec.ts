import { IsBase64DocumentConstraint } from './is-base64-document.validator';
import { decodedByteLength } from './base64-file';

describe('decodedByteLength', () => {
  it('computes the byte size without padding', () => {
    expect(decodedByteLength('QUJD')).toBe(3);
  });

  it('accounts for one padding character', () => {
    expect(decodedByteLength('QUI=')).toBe(2);
  });

  it('accounts for two padding characters', () => {
    expect(decodedByteLength('QQ==')).toBe(1);
  });
});

describe('IsBase64DocumentConstraint', () => {
  let validator: IsBase64DocumentConstraint;

  beforeEach(() => {
    validator = new IsBase64DocumentConstraint();
  });

  describe('formats valides', () => {
    it('should accept a valid PDF', () => {
      expect(
        validator.validate('data:application/pdf;base64,JVBERi0xLjQ=')
      ).toBe(true);
    });

    it('should accept a valid jpeg', () => {
      expect(validator.validate('data:image/jpeg;base64,/9j/4AAQSkZJRgAB')).toBe(
        true
      );
    });

    it('should accept a valid png', () => {
      expect(validator.validate('data:image/png;base64,iVBORw0KGgo=')).toBe(
        true
      );
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

    it('should reject executables (application/octet-stream)', () => {
      expect(
        validator.validate('data:application/octet-stream;base64,TVqQAAMAAAA=')
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
      expect(validator.validate('not-a-document')).toBe(false);
    });

    it('should reject an empty string', () => {
      expect(validator.validate('')).toBe(false);
    });

    it('should reject a non-string value', () => {
      expect(validator.validate(null as unknown as string)).toBe(false);
      expect(validator.validate(123 as unknown as string)).toBe(false);
    });
  });

  describe('protection DoS (taille décodée)', () => {
    it('should reject a file whose decoded size exceeds 10MB', () => {
      const oversized =
        'data:application/pdf;base64,' + 'A'.repeat(14 * 1024 * 1024);
      expect(validator.validate(oversized)).toBe(false);
    });

    it('should accept a file whose decoded size is within 10MB', () => {
      const withinLimit = 'data:application/pdf;base64,' + 'A'.repeat(100);
      expect(validator.validate(withinLimit)).toBe(true);
    });
  });

  describe("message d'erreur", () => {
    it('should return a descriptive error message', () => {
      expect(validator.defaultMessage()).toContain('10MB');
      expect(validator.defaultMessage()).toContain('PDF');
    });
  });
});
