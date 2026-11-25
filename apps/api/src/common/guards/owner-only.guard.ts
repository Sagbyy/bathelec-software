import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnerOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.userId === +request.params.userId) {
      return true;
    }

    throw new ForbiddenException(
      'Seul le propriétaire peut modifier ou supprimer ses documents.'
    );
  }
}
