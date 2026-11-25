import { Module } from '@nestjs/common';
import { DerivationsController } from './derivations.controller';
import { DerivationsService } from './derivations.service';
import { PrismaService } from '../prisma/prisma.service';
import { DerivationAccessService } from './access/derivation-access.service';

@Module({
  controllers: [DerivationsController],
  providers: [DerivationsService, DerivationAccessService, PrismaService],
  exports: [DerivationsService, DerivationAccessService],
})
export class DerivationsModule {}
