export type VehicleDocumentKey = 'vehicleRegistration' | 'drivingLicense';

export type VehicleDocumentExpiryKey = `${VehicleDocumentKey}ExpiresAt`;

export type VehicleDocumentFiles = Record<VehicleDocumentKey, string | null>;

export type VehicleDocumentExpiries = Partial<
  Record<VehicleDocumentExpiryKey, string | null>
>;

export interface VehicleDocument
  extends VehicleDocumentFiles,
    VehicleDocumentExpiries {
  _id: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateVehicleDocumentDto = Partial<VehicleDocumentFiles> &
  VehicleDocumentExpiries;
