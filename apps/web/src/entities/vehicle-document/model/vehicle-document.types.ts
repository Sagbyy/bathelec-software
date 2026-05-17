export interface VehicleDocument {
  _id: string;
  userId: number;
  carteGrise: string | null;
  permisDeConduire: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleDocumentDto {
  carteGrise?: string | null;
  permisDeConduire?: string | null;
}
