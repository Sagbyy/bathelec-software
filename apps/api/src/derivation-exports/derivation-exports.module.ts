import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedDerivation,
  CompletedDerivationSchema,
} from '../completed-derivation/entities/completed-derivations.entity';
import { PrismaService } from '../prisma/prisma.service';
import { DerivationExportsController } from './derivation-exports.controller';
import { DerivationExportsService } from './derivation-exports.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedDerivation.name, schema: CompletedDerivationSchema },
    ]),
  ],
  controllers: [DerivationExportsController],
  providers: [DerivationExportsService, PrismaService],
})
export class DerivationExportsModule {}
