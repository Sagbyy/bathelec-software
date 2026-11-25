import type { OfficialDocumentKey } from '../model/official-document.types';

export interface OfficialDocumentField {
  label: string;
  description: string;
  inputId: string;
}

export const OFFICIAL_DOCUMENT_FIELDS: Record<
  OfficialDocumentKey,
  OfficialDocumentField
> = {
  idCard: {
    label: "Pièce d'identité ou titre de séjour",
    description:
      "Carte nationale d'identité, passeport ou titre de séjour (jpeg, png, webp — max 5 Mo)",
    inputId: 'id-card-upload',
  },
  btpCard: {
    label: 'Carte professionnelle BTP',
    description: 'Carte BTP en cours de validité (jpeg, png, webp — max 5 Mo)',
    inputId: 'btp-card-upload',
  },
  mutualCard: {
    label: 'Carte mutuelle',
    description:
      'Attestation ou carte de mutuelle (jpeg, png, webp — max 5 Mo)',
    inputId: 'mutual-card-upload',
  },
};

export const OFFICIAL_DOCUMENT_KEYS = Object.keys(
  OFFICIAL_DOCUMENT_FIELDS
) as OfficialDocumentKey[];
