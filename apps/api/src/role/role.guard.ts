import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '@repo/types';
import { ROLE_METADATA_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.get<Role[]>(
      ROLE_METADATA_KEY,
      context.getHandler()
    );

    if (!roles) {
      roles = this.reflector.get<Role[]>(
        ROLE_METADATA_KEY,
        context.getClass()
      );
    }

    if (!roles || roles.length === 0) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.includes(user.role);
  }
}
