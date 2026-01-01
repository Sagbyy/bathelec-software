import { Module } from '@nestjs/common';
import { UsersGroupsService } from './users-groups.service';
import { UsersGroupsController } from './users-groups.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UsersGroupsController],
  providers: [UsersGroupsService, PrismaService],
})
export class UsersGroupsModule {}
