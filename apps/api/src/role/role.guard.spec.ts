import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@repo/types';
import { RoleGuard } from './role.guard';

function mockContext(user: object): ExecutionContext {
  return {
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

function createGuard(roles: string[] | undefined): RoleGuard {
  const reflector = {
    get: jest.fn().mockReturnValue(roles),
  } as unknown as Reflector;

  return new RoleGuard(reflector);
}

describe('RoleGuard', () => {
  it('allows a user whose role is the single allowed role', () => {
    const guard = createGuard([Role.ADMIN]);
    expect(guard.canActivate(mockContext({ role: Role.ADMIN }))).toBe(true);
  });

  it('allows a user whose role is one of several allowed roles', () => {
    const guard = createGuard([Role.ADMIN, Role.SUPERVISOR]);
    expect(guard.canActivate(mockContext({ role: Role.SUPERVISOR }))).toBe(
      true
    );
  });

  it('denies a user whose role is not in the allowed list', () => {
    const guard = createGuard([Role.ADMIN, Role.SUPERVISOR]);
    expect(guard.canActivate(mockContext({ role: Role.TECHNICIAN }))).toBe(
      false
    );
  });

  it('denies when no roles metadata is set', () => {
    const guard = createGuard(undefined);
    expect(guard.canActivate(mockContext({ role: Role.ADMIN }))).toBe(false);
  });

  it('denies when the allowed roles list is empty', () => {
    const guard = createGuard([]);
    expect(guard.canActivate(mockContext({ role: Role.ADMIN }))).toBe(false);
  });
});
