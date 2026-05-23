export interface SpecialHabilitations {
  electricalTitle: boolean;
  electricalTitleDoc: string | null;
  ss4Title: boolean;
  ss4TitleDoc: string | null;
  leadTitle: boolean;
  leadTitleDoc: string | null;
  sstCertificate: boolean;
  sstCertificateDoc: string | null;
}

export type SpecialHabilitationKey =
  | 'electricalTitle'
  | 'ss4Title'
  | 'leadTitle'
  | 'sstCertificate';

export type SpecialHabilitationDocKey =
  | 'electricalTitleDoc'
  | 'ss4TitleDoc'
  | 'leadTitleDoc'
  | 'sstCertificateDoc';

export interface SpecialHabilitationDocument extends SpecialHabilitations {
  _id?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateSpecialHabilitationDto = Partial<SpecialHabilitations>;

export const DEFAULT_SPECIAL_HABILITATIONS: SpecialHabilitations = {
  electricalTitle: false,
  electricalTitleDoc: null,
  ss4Title: false,
  ss4TitleDoc: null,
  leadTitle: false,
  leadTitleDoc: null,
  sstCertificate: false,
  sstCertificateDoc: null,
};

export interface SpecialHabilitationConfig {
  key: SpecialHabilitationKey;
  docKey: SpecialHabilitationDocKey;
  label: string;
  image: string;
  bgColor: string;
  borderColor: string;
}

export const SPECIAL_HABILITATION_CONFIG: SpecialHabilitationConfig[] = [
  {
    key: 'electricalTitle',
    docKey: 'electricalTitleDoc',
    label: "Titre d'habilitation électrique",
    image: '/images/electrical-habilitation.png',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  {
    key: 'ss4Title',
    docKey: 'ss4TitleDoc',
    label: "Titre d'habilitation SS4",
    image: '/images/ss4-habilitation.png',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    key: 'leadTitle',
    docKey: 'leadTitleDoc',
    label: "Titre d'habilitation Plomb",
    image: '/images/plomb-habilitation.png',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    key: 'sstCertificate',
    docKey: 'sstCertificateDoc',
    label: 'Certificat SST',
    image: '/images/sst-certificate.png',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
];
