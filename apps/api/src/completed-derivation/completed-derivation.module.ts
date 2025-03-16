import { Module } from '@nestjs/common';
import { CompletedDerivationService } from './completed-derivation.service';
import { CompletedDerivationController } from './completed-derivation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedDerivation,
  CompletedDerivationSchema,
} from './entities/completed-derivation.entity';

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
