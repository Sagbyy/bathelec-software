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

  @Prop({ type: String, default: null })
  drivingLicense: string;
}

export const VehicleDocumentSchema =
  SchemaFactory.createForClass(VehicleDocument);
