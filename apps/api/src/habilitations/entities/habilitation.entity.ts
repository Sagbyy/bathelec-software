import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type HabilitationDocument = Habilitation & Document;

@Schema({ timestamps: true, collection: 'habilitations' })
export class Habilitation {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  userId: number;

  // Non-électrique BT
  @Prop({ type: Boolean, default: false })
  b0: boolean;

  @Prop({ type: Boolean, default: false }) bs: boolean;
  @Prop({ type: Boolean, default: false }) be: boolean;

  // Non-électrique HT
  @Prop({ type: Boolean, default: false }) h0: boolean;
  @Prop({ type: Boolean, default: false }) h0v: boolean;

  // Exécutant
  @Prop({ type: Boolean, default: false }) b1: boolean;
  @Prop({ type: Boolean, default: false }) b1v: boolean;
  @Prop({ type: Boolean, default: false }) h1: boolean;
  @Prop({ type: Boolean, default: false }) h1v: boolean;

  // Chargé de travaux
  @Prop({ type: Boolean, default: false }) b2: boolean;
  @Prop({ type: Boolean, default: false }) b2v: boolean;
  @Prop({ type: Boolean, default: false }) b2vEssais: boolean;
  @Prop({ type: Boolean, default: false }) h2: boolean;
  @Prop({ type: Boolean, default: false }) h2v: boolean;
  @Prop({ type: Boolean, default: false }) h2vEssais: boolean;

  // Chargé de consignation
  @Prop({ type: Boolean, default: false }) bc: boolean;
  @Prop({ type: Boolean, default: false }) hc: boolean;

  // Chargé d'intervention
  @Prop({ type: Boolean, default: false }) br: boolean;

  // Chargé d'opérations
  @Prop({ type: Boolean, default: false }) beAttribut: boolean;
  @Prop({ type: Boolean, default: false }) heAttribut: boolean;
}

export const HabilitationSchema = SchemaFactory.createForClass(Habilitation);
