import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@repo/types';

@Injectable()
export class SelfAdminOrSupervisorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramUserId = +request.params.userId;

    if (
      user.role === Role.ADMIN ||
      user.role === Role.SUPERVISOR ||
      user.userId === paramUserId
    ) {
      return true;
    }

    throw new ForbiddenException();
  }
}
