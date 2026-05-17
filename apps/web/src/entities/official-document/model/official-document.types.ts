export interface OfficialDocument {
  _id: string;
  userId: number;
  pieceIdentite: string | null;
  carteProBtp: string | null;
  carteMutuelle: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfficialDocumentDto {
  pieceIdentite?: string | null;
  carteProBtp?: string | null;
  carteMutuelle?: string | null;
}
