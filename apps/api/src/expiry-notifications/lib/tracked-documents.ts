export type TrackedDocument = {
  technicianId: number;
  documentKey: string;
  documentLabel: string;
  expiresAt: Date;
};

type StoredRecord = { userId: number } & Record<string, unknown>;

type AttachedDocumentDefinition = {
  documentKey: string;
  documentLabel: string;
};

export const OFFICIAL_DOCUMENTS: AttachedDocumentDefinition[] = [
  {
    documentKey: 'idCard',
    documentLabel: "Pièce d'identité ou titre de séjour",
  },
  { documentKey: 'btpCard', documentLabel: 'Carte professionnelle BTP' },
  { documentKey: 'mutualCard', documentLabel: 'Carte mutuelle' },
];

export const VEHICLE_DOCUMENTS: AttachedDocumentDefinition[] = [
  { documentKey: 'vehicleRegistration', documentLabel: 'Carte grise' },
  { documentKey: 'drivingLicense', documentLabel: 'Permis de conduire' },
];

export const SPECIAL_HABILITATION_DOCUMENTS: AttachedDocumentDefinition[] = [
  {
    documentKey: 'electricalTitleDoc',
    documentLabel: "Titre d'habilitation électrique",
  },
  { documentKey: 'ss4TitleDoc', documentLabel: "Titre d'habilitation SS4" },
  { documentKey: 'leadTitleDoc', documentLabel: "Titre d'habilitation Plomb" },
  { documentKey: 'sstCertificateDoc', documentLabel: 'Certificat SST' },
];

export const HABILITATION_DOCUMENT_KEY = 'habilitation';
export const HABILITATION_DOCUMENT_LABEL = 'Habilitation NF C 18-510';

const asDate = (value: unknown) =>
  value instanceof Date || typeof value === 'string' ? new Date(value) : null;

export const trackAttachedDocuments = (
  records: StoredRecord[],
  definitions: AttachedDocumentDefinition[]
): TrackedDocument[] =>
  records.flatMap((record) =>
    definitions.flatMap(({ documentKey, documentLabel }) => {
      const expiresAt = asDate(record[`${documentKey}ExpiresAt`]);
      return record[documentKey] && expiresAt
        ? [
            {
              technicianId: record.userId,
              documentKey,
              documentLabel,
              expiresAt,
            },
          ]
        : [];
    })
  );

export const trackHabilitations = (
  records: StoredRecord[]
): TrackedDocument[] =>
  records.flatMap((record) => {
    const expiresAt = asDate(record.expiresAt);
    return expiresAt
      ? [
          {
            technicianId: record.userId,
            documentKey: HABILITATION_DOCUMENT_KEY,
            documentLabel: HABILITATION_DOCUMENT_LABEL,
            expiresAt,
          },
        ]
      : [];
  });
