import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type CompletedDerivationDocument = CompletedDerivation & Document;

@Schema({ timestamps: true, collection: 'completed-derivations' })
export class CompletedDerivation {
  _id: ObjectId;

  @Prop({ required: true })
  requestedDerivationId: number;

  @Prop({ type: Object, required: true })
  clientInfo: {
    name: string;
    phone: string;
    folio: string;
  };

  @Prop({ type: Object, required: true })
  generalInfo: {
    dateTime: Date;
    derivationBy: string;
    address: {
      street: string;
      postalCode: string;
      city: string;
    };
    building: string;
    cmIdentification: string;
    floor: string;
    situation: string;
    comment: string;
  };

  @Prop({ type: Object, required: true })
  photoBeforeWork: {
    photo: string;
  };

  @Prop({ type: Object, required: true })
  oldMeter: {
    type: string;
    generation: string;
    preserved: boolean;
    serialNumber: string;
    key: string;
    dayIndex: string;
    nightIndex: string;
  };

  @Prop({ type: Object, required: true })
  newDerivation: {
    section: string;
    cableType: string;
    length: number;
  };

  @Prop({ type: Object, required: true })
  newMeter: {
    generation: string;
    serialNumber: string;
    dayIndex: string;
    nightIndex: string;
    indexPhoto: string;
  };

  @Prop({ type: Object, required: true })
  circuitBreaker: {
    preserved: boolean;
    voltage: string;
    brand: string;
    type: string;
    power: string;
    commissioningDone: boolean;
    sealed: boolean;
  };

  @Prop({ type: Object, required: true })
  photoAfterWork: {
    photo: string;
    secondPhoto?: string;
    thirdPhoto?: string;
  };

  @Prop({ type: Object, required: true })
  clientValidation: {
    present: boolean;
    workValidation: boolean;
    satisfactionLevel: string;
    clientComment: string;
    signature: string;
    technicianComment: string;
  };
}

export const CompletedDerivationSchema =
  SchemaFactory.createForClass(CompletedDerivation);
