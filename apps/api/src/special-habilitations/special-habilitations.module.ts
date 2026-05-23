import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SpecialHabilitation,
  SpecialHabilitationSchema,
} from './entities/special-habilitation.entity';
import { SpecialHabilitationsController } from './special-habilitations.controller';
import { SpecialHabilitationsService } from './special-habilitations.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecialHabilitation.name, schema: SpecialHabilitationSchema },
    ]),
    UsersModule,
  ],
  controllers: [SpecialHabilitationsController],
  providers: [SpecialHabilitationsService],
})
export class SpecialHabilitationsModule {}
