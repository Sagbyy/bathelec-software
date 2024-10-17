import { Module } from '@nestjs/common';
import { DerivationsController } from './derivations.controller';
import { DerivationsService } from './derivations.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DerivationsController],
  providers: [DerivationsService, PrismaService],
  exports: [DerivationsService],
})
export class DerivationsModule {}
