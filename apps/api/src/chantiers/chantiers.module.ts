import { Module } from '@nestjs/common';
import { ChantiersController } from './chantiers.controller';
import { ChantiersService } from './chantiers.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ChantiersController],
  providers: [ChantiersService, PrismaService],
  exports: [ChantiersService],
})
export class ChantiersModule {}
