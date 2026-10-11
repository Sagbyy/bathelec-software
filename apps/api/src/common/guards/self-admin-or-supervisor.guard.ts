import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@repo/types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SelfAdminOrSupervisorGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException();
    }

    const paramUserId = +request.params.userId;

    if (user.userId === paramUserId || user.role === Role.ADMIN) {
      return true;
    }

    if (user.role === Role.SUPERVISOR) {
      const target = await this.prisma.user.findUnique({
        where: { id: paramUserId },
        select: { role: true },
      });

      if (target?.role === Role.ADMIN) {
        throw new ForbiddenException();
      }

      return true;
    }

    throw new ForbiddenException();
  }
}
