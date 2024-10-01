import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let role = this.reflector.get<string>('role', context.getHandler());

    if (!role) {
      role = this.reflector.get<string>('role', context.getClass());
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user.role === role;
  }
}
