import {
  OFFICIAL_DOCUMENTS,
  trackAttachedDocuments,
  trackHabilitations,
} from './tracked-documents';

describe('tracked documents', () => {
  it('tracks attached documents that have an expiry date', () => {
    const tracked = trackAttachedDocuments(
      [
        {
          userId: 4,
          idCard: 'data:image/png;base64,AAA',
          idCardExpiresAt: new Date('2026-12-01'),
          btpCard: 'data:image/png;base64,BBB',
          btpCardExpiresAt: null,
          mutualCard: null,
          mutualCardExpiresAt: new Date('2026-12-01'),
        },
      ],
      OFFICIAL_DOCUMENTS
    );

    expect(tracked).toEqual([
      {
        technicianId: 4,
        documentKey: 'idCard',
        documentLabel: "Pièce d'identité ou titre de séjour",
        expiresAt: new Date('2026-12-01'),
      },
    ]);
  });

  it('tracks the NF C 18-510 habilitation title', () => {
    expect(
      trackHabilitations([
        { userId: 4, expiresAt: '2027-01-15T00:00:00.000Z' },
        { userId: 5, expiresAt: null },
      ])
    ).toEqual([
      {
        technicianId: 4,
        documentKey: 'habilitation',
        documentLabel: 'Habilitation NF C 18-510',
        expiresAt: new Date('2027-01-15T00:00:00.000Z'),
      },
    ]);
  });
});
