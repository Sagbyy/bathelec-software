import { describe, it, expect } from 'vitest';
import {
  createCompletedDerivationSchema,
  oldMeterRequiresKey,
} from './derivation-form.schema';

const hasIssueAt = (
  result: ReturnType<typeof createCompletedDerivationSchema.safeParse>,
  segment: string,
  field: string
) =>
  result.error?.issues.some(
    (i) => i.path[0] === segment && i.path.includes(field)
  ) ?? false;

const validClientInfo = {
  name: 'M. DUPONT',
  phone: '+33612345678',
  folio: 'SGX001',
};

const validGeneralInfo = {
  dateTime: new Date().toISOString(),
  derivationBy: 'Technicien A',
  address: {
    street: '1 rue de la Paix',
    postalCode: '75001',
    city: 'Paris',
  },
  building: 'Bâtiment A',
  cmIdentification: 'CM001',
  floor: '1er',
  situation: 'Gauche',
  comment: '',
};

const validData = {
  clientInfo: validClientInfo,
  generalInfo: validGeneralInfo,
  photoBeforeWork: {
    photo: 'data:image/jpeg;base64,abc123',
  },
  oldMeter: {
    type: 'standard',
    generation: '',
    preserved: false,
    serialNumber: '123',
    key: 'A',
    dayIndex: '1000',
    indexPhoto: 'data:image/jpeg;base64,abc',
  },
  newDerivation: {
    section: '6mm²',
    cableType: 'Cuivre',
    length: 10,
  },
  newMeter: {
    generation: '1ère',
    serialNumber: '123456789012',
    key: '34',
    dayIndex: '0',
    indexPhoto: 'data:image/jpeg;base64,abc',
  },
  circuitBreaker: {
    preserved: false,
    voltage: 'mono',
    brand: 'Schneider',
    type: 'differentiel',
    power: '60A',
    commissioningDone: true,
    sealed: true,
  },
  photoAfterWork: {
    photo: 'data:image/jpeg;base64,abc123',
  },
  clientValidation: {
    present: false,
    technicianComment: 'RAS',
  },
};

describe('createCompletedDerivationSchema', () => {
  it('validates complete valid data', () => {
    expect(createCompletedDerivationSchema.safeParse(validData).success).toBe(
      true
    );
  });

  describe('clientInfo', () => {
    it('rejects name shorter than 2 characters', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        clientInfo: { ...validClientInfo, name: 'A' },
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes('name'))).toBe(
        true
      );
    });

    it('rejects invalid phone number', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        clientInfo: { ...validClientInfo, phone: 'invalid-phone' },
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes('phone'))).toBe(
        true
      );
    });

    it('rejects empty folio', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        clientInfo: { ...validClientInfo, folio: '' },
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.path.includes('folio'))).toBe(
        true
      );
    });
  });

  describe('generalInfo', () => {
    it('rejects postal code not matching 5 digits', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        generalInfo: {
          ...validGeneralInfo,
          address: { ...validGeneralInfo.address, postalCode: '1234' },
        },
      });
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes('postalCode'))
      ).toBe(true);
    });

    it('rejects invalid dateTime format', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        generalInfo: { ...validGeneralInfo, dateTime: 'not-a-date' },
      });
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.some((i) => i.path.includes('dateTime'))
      ).toBe(true);
    });
  });

  describe('circuitBreaker', () => {
    it('rejects invalid voltage value', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        circuitBreaker: {
          ...validData.circuitBreaker,
          voltage: 'invalid',
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid circuit breaker type', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        circuitBreaker: { ...validData.circuitBreaker, type: 'invalid' },
      });
      expect(result.success).toBe(false);
    });

    it('accepts tri voltage', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        circuitBreaker: { ...validData.circuitBreaker, voltage: 'tri' },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('oldMeter linky validation', () => {
    it('requires generation when type is linky', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        oldMeter: {
          ...validData.oldMeter,
          type: 'linky',
          generation: '',
        },
      });
      expect(result.success).toBe(false);
      const linkyError = result.error?.issues.find(
        (i) =>
          i.path[0] === 'oldMeter' && i.message.includes('génération')
      );
      expect(linkyError).toBeDefined();
    });

    it('accepts linky meter with generation', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        oldMeter: {
          ...validData.oldMeter,
          type: 'linky',
          generation: '3ème génération',
          serialNumber: '123456789012',
          key: '34',
        },
      });
      const linkyErrors =
        result.error?.issues.filter(
          (i) => i.path[0] === 'oldMeter' && i.message.includes('génération')
        ) ?? [];
      expect(linkyErrors).toHaveLength(0);
    });
  });

  describe('oldMeterRequiresKey helper', () => {
    it('requires a key for CBE meters', () => {
      expect(oldMeterRequiresKey({ type: 'cbe' })).toBe(true);
    });

    it('requires a key for Linky meters', () => {
      expect(oldMeterRequiresKey({ type: 'linky' })).toBe(true);
    });

    it('does not require a key for electromecanique meters', () => {
      expect(oldMeterRequiresKey({ type: 'electromecanique' })).toBe(false);
    });

    it('falls back to no key when kept and Linky refused', () => {
      expect(
        oldMeterRequiresKey({
          type: 'cbe',
          preserved: true,
          linkyRefusal: true,
        })
      ).toBe(false);
    });
  });

  describe('oldMeter matricule format (DTA-69)', () => {
    it('accepts a 3-digit matricule without key for electromecanique', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        oldMeter: {
          ...validData.oldMeter,
          type: 'electromecanique',
          serialNumber: '123',
          key: '',
        },
      });
      expect(hasIssueAt(result, 'oldMeter', 'serialNumber')).toBe(false);
      expect(hasIssueAt(result, 'oldMeter', 'key')).toBe(false);
    });

    it('rejects a 3-digit matricule for CBE meters', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        oldMeter: {
          ...validData.oldMeter,
          type: 'cbe',
          serialNumber: '123',
          key: '34',
        },
      });
      expect(result.success).toBe(false);
      expect(hasIssueAt(result, 'oldMeter', 'serialNumber')).toBe(true);
    });

    it('requires a 2-digit key for CBE meters', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        oldMeter: {
          ...validData.oldMeter,
          type: 'cbe',
          serialNumber: '123456789012',
          key: '',
        },
      });
      expect(result.success).toBe(false);
      expect(hasIssueAt(result, 'oldMeter', 'key')).toBe(true);
    });

    it('accepts a 12-digit matricule + 2-digit key for CBE meters', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        oldMeter: {
          ...validData.oldMeter,
          type: 'cbe',
          serialNumber: '123456789012',
          key: '34',
        },
      });
      expect(hasIssueAt(result, 'oldMeter', 'serialNumber')).toBe(false);
      expect(hasIssueAt(result, 'oldMeter', 'key')).toBe(false);
    });

    it('accepts a 3-digit matricule without key when kept and Linky refused', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        oldMeter: {
          ...validData.oldMeter,
          type: 'cbe',
          preserved: true,
          linkyRefusal: true,
          serialNumber: '123',
          key: '',
        },
      });
      expect(hasIssueAt(result, 'oldMeter', 'serialNumber')).toBe(false);
      expect(hasIssueAt(result, 'oldMeter', 'key')).toBe(false);
    });
  });

  describe('newMeter matricule format (DTA-69)', () => {
    it('rejects a 3-digit matricule', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        newMeter: { ...validData.newMeter, serialNumber: '456' },
      });
      expect(result.success).toBe(false);
      expect(hasIssueAt(result, 'newMeter', 'serialNumber')).toBe(true);
    });

    it('requires a 2-digit key', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        newMeter: { ...validData.newMeter, key: '' },
      });
      expect(result.success).toBe(false);
      expect(hasIssueAt(result, 'newMeter', 'key')).toBe(true);
    });

    it('accepts a 12-digit matricule + 2-digit key', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        newMeter: {
          ...validData.newMeter,
          serialNumber: '123456789012',
          key: '34',
        },
      });
      expect(hasIssueAt(result, 'newMeter', 'serialNumber')).toBe(false);
      expect(hasIssueAt(result, 'newMeter', 'key')).toBe(false);
    });
  });

  describe('photoAfterWork (DTA-65)', () => {
    it('accepts up to four photos', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        photoAfterWork: {
          photo: 'data:image/jpeg;base64,p1',
          secondPhoto: 'data:image/jpeg;base64,p2',
          thirdPhoto: 'data:image/jpeg;base64,p3',
          fourthPhoto: 'data:image/jpeg;base64,p4',
        },
      });
      expect(result.success).toBe(true);
    });

    it('keeps the extra photos optional', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        photoAfterWork: { photo: 'data:image/jpeg;base64,p1' },
      });
      expect(result.success).toBe(true);
    });

    it('still requires the main photo', () => {
      const result = createCompletedDerivationSchema.safeParse({
        ...validData,
        photoAfterWork: {
          photo: null,
          fourthPhoto: 'data:image/jpeg;base64,p4',
        },
      });
      expect(result.success).toBe(false);
      expect(hasIssueAt(result, 'photoAfterWork', 'photo')).toBe(true);
    });
  });
});
