import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SelfOrAdminGuard } from './self-or-admin.guard';

function mockContext(user: object, params: object): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user, params }),
    }),
  } as unknown as ExecutionContext;
}

describe('SelfOrAdminGuard', () => {
  let guard: SelfOrAdminGuard;

  beforeEach(() => {
    guard = new SelfOrAdminGuard();
  });

  it('should allow a user to access their own resource', () => {
    const ctx = mockContext({ userId: 1, role: 'technician' }, { userId: '1' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow an admin to access any resource', () => {
    const ctx = mockContext({ userId: 99, role: 'admin' }, { userId: '1' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should throw ForbiddenException when a user accesses another user resource', () => {
    const ctx = mockContext({ userId: 2, role: 'technician' }, { userId: '1' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
