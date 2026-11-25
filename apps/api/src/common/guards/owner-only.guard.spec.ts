import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OwnerOnlyGuard } from './owner-only.guard';

function mockContext(user: object | undefined, params: object) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user, params }),
    }),
  } as unknown as ExecutionContext;
}

describe('OwnerOnlyGuard', () => {
  const guard = new OwnerOnlyGuard();

  it('allows the owner of the resource', () => {
    const ctx = mockContext({ userId: 1, role: 'technician' }, { userId: '1' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it.each(['admin', 'supervisor', 'technician'])(
    'forbids a %s acting on another user resource',
    (role) => {
      const ctx = mockContext({ userId: 99, role }, { userId: '1' });
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    }
  );

  it('forbids an unauthenticated request', () => {
    const ctx = mockContext(undefined, { userId: '1' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
