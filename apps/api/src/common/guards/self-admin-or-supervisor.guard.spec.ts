import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@repo/types';
import { SelfAdminOrSupervisorGuard } from './self-admin-or-supervisor.guard';

function mockContext(user: unknown, params: object): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user, params }),
    }),
  } as unknown as ExecutionContext;
}

describe('SelfAdminOrSupervisorGuard', () => {
  let guard: SelfAdminOrSupervisorGuard;
  let findUnique: jest.Mock;

  beforeEach(() => {
    findUnique = jest.fn();
    guard = new SelfAdminOrSupervisorGuard({
      user: { findUnique },
    } as never);
  });

  it('should allow a user to access their own resource without a database lookup', async () => {
    const ctx = mockContext(
      { userId: 1, role: Role.TECHNICIAN },
      { userId: '1' }
    );
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('should allow an admin to access any resource without a database lookup', async () => {
    const ctx = mockContext({ userId: 99, role: Role.ADMIN }, { userId: '1' });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('should allow a supervisor to access a non-admin resource', async () => {
    findUnique.mockResolvedValue({ role: Role.TECHNICIAN });
    const ctx = mockContext(
      { userId: 99, role: Role.SUPERVISOR },
      { userId: '1' }
    );
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { role: true },
    });
  });

  it("should forbid a supervisor from accessing an admin's resource", async () => {
    findUnique.mockResolvedValue({ role: Role.ADMIN });
    const ctx = mockContext(
      { userId: 99, role: Role.SUPERVISOR },
      { userId: '1' }
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('should forbid a site manager from accessing another user resource', async () => {
    const ctx = mockContext(
      { userId: 2, role: Role.SITE_MANAGER },
      { userId: '1' }
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('should forbid a technician from accessing another user resource', async () => {
    const ctx = mockContext(
      { userId: 2, role: Role.TECHNICIAN },
      { userId: '1' }
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('should forbid when the request carries no authenticated user', async () => {
    const ctx = mockContext(undefined, { userId: '1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
