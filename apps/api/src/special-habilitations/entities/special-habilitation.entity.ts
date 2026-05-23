import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type SpecialHabilitationDocument = SpecialHabilitation & Document;

@Schema({ timestamps: true, collection: 'special_habilitations' })
export class SpecialHabilitation {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  userId: number;

  @Prop({ type: Boolean, default: false }) electricalTitle: boolean;
  @Prop({ type: String, default: null }) electricalTitleDoc: string | null;

  @Prop({ type: Boolean, default: false }) ss4Title: boolean;
  @Prop({ type: String, default: null }) ss4TitleDoc: string | null;

  @Prop({ type: Boolean, default: false }) leadTitle: boolean;
  @Prop({ type: String, default: null }) leadTitleDoc: string | null;

  @Prop({ type: Boolean, default: false }) sstCertificate: boolean;
  @Prop({ type: String, default: null }) sstCertificateDoc: string | null;
}

export const SpecialHabilitationSchema =
  SchemaFactory.createForClass(SpecialHabilitation);
