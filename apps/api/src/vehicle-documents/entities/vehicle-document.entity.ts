import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type VehicleDocumentDocument = VehicleDocument & Document;

@Schema({ timestamps: true, collection: 'vehicle-documents' })
export class VehicleDocument {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  userId: number;

  @Prop({ type: String, default: null })
  vehicleRegistration: string;

  @Prop({ type: Date, default: null })
  vehicleRegistrationExpiresAt: Date | null;

  @Prop({ type: String, default: null })
  drivingLicense: string;

  @Prop({ type: Date, default: null })
  drivingLicenseExpiresAt: Date | null;
}

export const VehicleDocumentSchema =
  SchemaFactory.createForClass(VehicleDocument);
