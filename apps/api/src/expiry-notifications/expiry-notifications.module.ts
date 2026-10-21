import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaService } from '../prisma/prisma.service';
import {
  OfficialDocument,
  OfficialDocumentSchema,
} from '../official-documents/entities/official-document.entity';
import {
  VehicleDocument,
  VehicleDocumentSchema,
} from '../vehicle-documents/entities/vehicle-document.entity';
import {
  SpecialHabilitation,
  SpecialHabilitationSchema,
} from '../special-habilitations/entities/special-habilitation.entity';
import {
  Habilitation,
  HabilitationSchema,
} from '../habilitations/entities/habilitation.entity';
import { ExpiryMailerService } from './expiry-mailer.service';
import { ExpiryNotificationsController } from './expiry-notifications.controller';
import { ExpiryNotificationsScheduler } from './expiry-notifications.scheduler';
import { ExpiryNotificationsService } from './expiry-notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OfficialDocument.name, schema: OfficialDocumentSchema },
      { name: VehicleDocument.name, schema: VehicleDocumentSchema },
      { name: SpecialHabilitation.name, schema: SpecialHabilitationSchema },
      { name: Habilitation.name, schema: HabilitationSchema },
    ]),
  ],
  controllers: [ExpiryNotificationsController],
  providers: [
    PrismaService,
    ExpiryMailerService,
    ExpiryNotificationsService,
    ExpiryNotificationsScheduler,
  ],
})
export class ExpiryNotificationsModule {}
