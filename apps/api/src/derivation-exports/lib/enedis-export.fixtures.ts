import { EnedisExportSource } from './enedis-export.columns';

export const buildSource = (
  overrides: Partial<EnedisExportSource['report']> = {}
): EnedisExportSource => ({
  derivationId: 1,
  chantier: {
    address: '3 RUE PAILLET 75005 PARIS',
    enedisAffaireNumber: 'DC21/014312',
    internalAffaireNumber: 'BA570035',
    market: { name: 'DR Paris' },
  },
  report: {
    clientInfo: {
      name: 'DUPONT',
      phone: '+33612345678',
      folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
    },
    generalInfo: {
      dateTime: new Date('2026-10-01T09:00:00.000Z'),
      derivationBy: 'Jean Tech',
      address: { street: '3 rue Paillet', postalCode: '75005', city: 'Paris' },
      building: 'A',
      cmIdentification: '1D001',
      floor: '2',
      situation: 'gauche',
      comment: '',
    },
    oldMeter: {
      type: 'linky',
      generation: 'g1',
      preserved: false,
      serialNumber: '123456789012',
      key: '12',
      dayIndex: '1000',
      nightIndex: '500',
    },
    newDerivation: { section: '2x25', cableType: 'cuivre', length: 12 },
    newMeter: {
      generation: 'g3',
      serialNumber: '210987654321',
      key: '34',
      dayIndex: '0',
      nightIndex: '0',
      indexPhoto: '',
    },
    circuitBreaker: {
      preserved: true,
      voltage: 'mono',
      brand: 'SCHNEIDER',
      type: 'selectif',
      power: '15-45',
      calibrationPower: '45A',
      commissioningDone: true,
      sealed: true,
      testButton: 'working',
      replacementExplanation: '',
    },
    clientValidation: {
      present: true,
      workValidation: true,
      satisfactionLevel: '4',
      clientComment: 'Parfait',
      signature: 'data:image/png;base64,client',
      technicianComment: '',
      technicianNothingToReport: true,
      technicianSignature: 'data:image/png;base64,tech',
    },
    ...overrides,
  },
});
