import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type OfficialDocumentDocument = OfficialDocument & Document;

@Schema({ timestamps: true, collection: 'official-documents' })
export class OfficialDocument {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  userId: number;

  @Prop({ type: String, default: null })
  idCard: string;

  @Prop({ type: String, default: null })
  btpCard: string;

  @Prop({ type: String, default: null })
  mutualCard: string;
}

export const OfficialDocumentSchema =
  SchemaFactory.createForClass(OfficialDocument);
