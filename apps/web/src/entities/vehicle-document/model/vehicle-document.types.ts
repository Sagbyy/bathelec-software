export interface VehicleDocument {
  _id: string;
  userId: number;
  vehicleRegistration: string | null;
  drivingLicense: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleDocumentDto {
  vehicleRegistration?: string | null;
  drivingLicense?: string | null;
}
