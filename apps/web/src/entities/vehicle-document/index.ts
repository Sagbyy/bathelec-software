export { vehicleDocumentService } from './api/vehicle-document.service';
export {
  useVehicleDocument,
  useUpsertVehicleDocument,
} from './model/use-vehicle-document';
export type {
  VehicleDocument,
  VehicleDocumentKey,
  CreateVehicleDocumentDto,
} from './model/vehicle-document.types';
export {
  VEHICLE_DOCUMENT_FIELDS,
  VEHICLE_DOCUMENT_KEYS,
} from './config/vehicle-document-fields';
