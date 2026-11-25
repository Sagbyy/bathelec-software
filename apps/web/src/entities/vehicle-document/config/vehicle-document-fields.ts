import type { VehicleDocumentKey } from '../model/vehicle-document.types';

export interface VehicleDocumentField {
  label: string;
  description: string;
  inputId: string;
}

export const VEHICLE_DOCUMENT_FIELDS: Record<
  VehicleDocumentKey,
  VehicleDocumentField
> = {
  vehicleRegistration: {
    label: 'Carte grise',
    description:
      'Photo ou scan de la carte grise du véhicule (jpeg, png, webp — max 5 Mo)',
    inputId: 'vehicle-registration-upload',
  },
  drivingLicense: {
    label: 'Permis de conduire',
    description:
      'Photo ou scan du permis de conduire (jpeg, png, webp — max 5 Mo)',
    inputId: 'driving-license-upload',
  },
};

export const VEHICLE_DOCUMENT_KEYS = Object.keys(
  VEHICLE_DOCUMENT_FIELDS
) as VehicleDocumentKey[];
