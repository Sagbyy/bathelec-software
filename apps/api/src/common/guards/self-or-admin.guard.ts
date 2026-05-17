import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramUserId = +request.params.userId;

    if (user.role === 'admin' || user.userId === paramUserId) {
      return true;
    }

    throw new ForbiddenException();
  }
}
