import { Module } from '@nestjs/common';
import { SiteTeamsService } from './site-teams.service';
import { SiteTeamsController } from './site-teams.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SiteTeamsController],
  providers: [SiteTeamsService, PrismaService],
})
export class SiteTeamsModule {}
