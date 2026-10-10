import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type ChantierDocumentDocument = ChantierDocument & Document;

@Schema({ timestamps: true, collection: 'chantier-documents' })
export class ChantierDocument {
  _id: ObjectId;

  @Prop({ required: true, index: true })
  chantierId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  file: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  uploadedById: number;
}

export const ChantierDocumentSchema =
  SchemaFactory.createForClass(ChantierDocument);
