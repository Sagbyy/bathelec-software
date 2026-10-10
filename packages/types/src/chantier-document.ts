export enum ChantierDocumentType {
  MARKET_STUDY = 'market_study',
  LEAD_DIAGNOSIS = 'lead_diagnosis',
  ASBESTOS_DIAGNOSIS = 'asbestos_diagnosis',
  SITE_PLANNING = 'site_planning',
  DERIVATION_PLANNING = 'derivation_planning',
  OTHER = 'other',
}

export const CHANTIER_DOCUMENT_TYPE_VALUES: ChantierDocumentType[] =
  Object.values(ChantierDocumentType) as ChantierDocumentType[];

export const CHANTIER_DOCUMENT_TYPE_LABELS: Record<
  ChantierDocumentType,
  string
> = {
  [ChantierDocumentType.MARKET_STUDY]: 'Étude de marché',
  [ChantierDocumentType.LEAD_DIAGNOSIS]: 'Diagnostic plomb',
  [ChantierDocumentType.ASBESTOS_DIAGNOSIS]: 'Diagnostic amiante',
  [ChantierDocumentType.SITE_PLANNING]: 'Planning chantier',
  [ChantierDocumentType.DERIVATION_PLANNING]: 'Planning dérivation chantier',
  [ChantierDocumentType.OTHER]: 'Autre',
};

export interface ChantierDocument {
  _id: string;
  chantierId: number;
  name: string;
  type: ChantierDocumentType;
  mimeType: string;
  size: number;
  uploadedById: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChantierDocumentWithFile extends ChantierDocument {
  file: string;
}
