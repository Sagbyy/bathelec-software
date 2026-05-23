export interface OfficialDocument {
  _id: string;
  userId: number;
  idCard: string | null;
  btpCard: string | null;
  mutualCard: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfficialDocumentDto {
  idCard?: string | null;
  btpCard?: string | null;
  mutualCard?: string | null;
}
