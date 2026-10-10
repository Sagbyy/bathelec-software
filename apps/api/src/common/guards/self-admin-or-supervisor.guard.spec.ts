import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@repo/types';
import { SelfAdminOrSupervisorGuard } from './self-admin-or-supervisor.guard';

function mockContext(user: object, params: object): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user, params }),
    }),
  } as unknown as ExecutionContext;
}

describe('SelfAdminOrSupervisorGuard', () => {
  let guard: SelfAdminOrSupervisorGuard;

  beforeEach(() => {
    guard = new SelfAdminOrSupervisorGuard();
  });

  it('should allow a user to access their own resource', () => {
    const ctx = mockContext(
      { userId: 1, role: Role.TECHNICIAN },
      { userId: '1' }
    );
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow an admin to access any resource', () => {
    const ctx = mockContext({ userId: 99, role: Role.ADMIN }, { userId: '1' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow a supervisor to access any resource', () => {
    const ctx = mockContext(
      { userId: 99, role: Role.SUPERVISOR },
      { userId: '1' }
    );
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should throw ForbiddenException when a site manager accesses another user resource', () => {
    const ctx = mockContext(
      { userId: 2, role: Role.SITE_MANAGER },
      { userId: '1' }
    );
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when a technician accesses another user resource', () => {
    const ctx = mockContext(
      { userId: 2, role: Role.TECHNICIAN },
      { userId: '1' }
    );
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
