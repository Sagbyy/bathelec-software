export type OfficialDocumentKey = 'idCard' | 'btpCard' | 'mutualCard';

export type OfficialDocumentExpiryKey = `${OfficialDocumentKey}ExpiresAt`;

export type OfficialDocumentFiles = Record<OfficialDocumentKey, string | null>;

export type OfficialDocumentExpiries = Partial<
  Record<OfficialDocumentExpiryKey, string | null>
>;

export interface OfficialDocument
  extends OfficialDocumentFiles,
    OfficialDocumentExpiries {
  _id: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateOfficialDocumentDto = Partial<OfficialDocumentFiles> &
  OfficialDocumentExpiries;
