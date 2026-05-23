import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Habilitation,
  HabilitationSchema,
} from './entities/habilitation.entity';
import { HabilitationsController } from './habilitations.controller';
import { HabilitationsService } from './habilitations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Habilitation.name, schema: HabilitationSchema },
    ]),
  ],
  controllers: [HabilitationsController],
  providers: [HabilitationsService],
})
export class HabilitationsModule {}
