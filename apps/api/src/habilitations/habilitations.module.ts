import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Habilitation,
  HabilitationSchema,
} from './entities/habilitation.entity';
import { HabilitationsController } from './habilitations.controller';
import { HabilitationsService } from './habilitations.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Habilitation.name, schema: HabilitationSchema },
    ]),
    UsersModule,
  ],
  controllers: [HabilitationsController],
  providers: [HabilitationsService],
})
export class HabilitationsModule {}
