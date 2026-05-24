import {
  CHANTIERS_BY_MARKET,
  buildCompletedDerivationData,
  buildSeedPhone,
  getSeedChantierEnedisNumbers,
  parseAddress,
  threeDigitMatricule,
} from './seed-data';

describe('seed data helpers', () => {
  it('formats meter matricules with exactly 3 digits', () => {
    expect(threeDigitMatricule(1)).toBe('001');
    expect(threeDigitMatricule(42)).toBe('042');
    expect(threeDigitMatricule(999)).toBe('999');
    expect(threeDigitMatricule(1001)).toBe('001');
  });

  it('builds a random-looking French mobile phone without using the forbidden value', () => {
    const phones = Array.from({ length: 20 }, (_, index) =>
      buildSeedPhone(index + 1)
    );

    expect(phones).toEqual(
      expect.arrayContaining([expect.stringMatching(/^\+337\d{8}$/)])
    );
    expect(phones).not.toContain('+33783131466');
    expect(new Set(phones).size).toBeGreaterThan(1);
  });

  it('extracts street, postal code and city from a chantier address', () => {
    expect(parseAddress('3 RUE PAILLET 75005 PARIS')).toEqual({
      street: '3 RUE PAILLET',
      postalCode: '75005',
      city: 'PARIS',
    });
  });

  it('builds complete Mongo derivation data matching frontend constraints', () => {
    const data = buildCompletedDerivationData(42, '3 RUE PAILLET 75005 PARIS');

    expect(data.clientInfo).toEqual({
      name: 'Client Seed',
      phone: expect.stringMatching(/^\+337\d{8}$/),
      folio: 'FOLIO-42',
    });
    expect(data.clientInfo.phone).not.toBe('+33783131466');
    expect(data.generalInfo.building).toBeTruthy();
    expect(data.generalInfo.cmIdentification).toBe('CM-042');
    expect(data.generalInfo.floor).toBeTruthy();
    expect(data.generalInfo.situation).toBeTruthy();
    expect(data.generalInfo.comment).toBeTruthy();
    expect(data.oldMeter.serialNumber).toMatch(/^\d{3}$/);
    expect(data.newMeter.serialNumber).toMatch(/^\d{3}$/);
    expect(data.oldMeter.indexPhoto).toBeTruthy();
    expect(data.newMeter.indexPhoto).toBeTruthy();
    expect(data.newDerivation.length).toBeGreaterThanOrEqual(4);
    expect(data.newDerivation.length).toBeLessThanOrEqual(18);
    expect(data.circuitBreaker.voltage).toBe('mono');
    expect(data.circuitBreaker.type).toBe('selectif');
    expect(data.photoAfterWork.secondPhoto).toBeTruthy();
    expect(data.photoAfterWork.thirdPhoto).toBeTruthy();
  });

  it('returns the unique Enedis numbers used to undo seeded chantiers', () => {
    const expectedCount = Object.values(CHANTIERS_BY_MARKET).flat().length;
    const enedisNumbers = getSeedChantierEnedisNumbers();

    expect(enedisNumbers).toHaveLength(expectedCount);
    expect(new Set(enedisNumbers).size).toBe(expectedCount);
    expect(enedisNumbers).toContain('DC21/014312');
    expect(enedisNumbers).toContain('DC21/021034');
  });
});
