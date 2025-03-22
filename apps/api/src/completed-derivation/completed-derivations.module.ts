import { Module } from '@nestjs/common';
import { CompletedDerivationService } from './completed-derivations.service';
import { CompletedDerivationController } from './completed-derivations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedDerivation,
  CompletedDerivationSchema,
} from './entities/completed-derivations.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedDerivation.name, schema: CompletedDerivationSchema },
    ]),
  ],
  controllers: [CompletedDerivationController],
  providers: [CompletedDerivationService],
})
export class CompletedDerivationModule {}
