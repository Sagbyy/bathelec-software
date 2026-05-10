import { describe, it, expect } from 'vitest';
import { createCompletedDerivationSchema } from './derivation-form.schema';

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
    serialNumber: '456',
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
        },
      });
      const linkyErrors =
        result.error?.issues.filter(
          (i) => i.path[0] === 'oldMeter' && i.message.includes('génération')
        ) ?? [];
      expect(linkyErrors).toHaveLength(0);
    });
  });
});
