import { Test, TestingModule } from '@nestjs/testing';
import { Role as UserRole } from '@repo/types';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { ROLE_METADATA_KEY } from '../role/role.decorator';
import { ExpiryNotificationsController } from './expiry-notifications.controller';
import { ExpiryNotificationsService } from './expiry-notifications.service';
import { ExpiryNotificationsScheduler } from './expiry-notifications.scheduler';

describe('ExpiryNotificationsController', () => {
  let controller: ExpiryNotificationsController;
  const notifications = {
    findForUser: jest.fn(),
    acknowledge: jest.fn(),
    scan: jest.fn(),
  };
  const user = { userId: 4, username: 'tech', role: UserRole.TECHNICIAN };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpiryNotificationsController],
      providers: [
        { provide: ExpiryNotificationsService, useValue: notifications },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get(ExpiryNotificationsController);
  });

  it('lists the notifications of the current user', async () => {
    notifications.findForUser.mockResolvedValue([]);

    await controller.findMine(user);

    expect(notifications.findForUser).toHaveBeenCalledWith(user);
  });

  it('acknowledges a notification for the current user', async () => {
    await controller.acknowledge(1, user);

    expect(notifications.acknowledge).toHaveBeenCalledWith(1, user);
  });

  it('restricts the manual scan to admins', () => {
    expect(
      Reflect.getMetadata(
        ROLE_METADATA_KEY,
        ExpiryNotificationsController.prototype.scan
      )
    ).toEqual([UserRole.ADMIN]);
  });

  it('runs the scan every day from the scheduler', async () => {
    const scheduler = new ExpiryNotificationsScheduler(
      notifications as unknown as ExpiryNotificationsService
    );

    await scheduler.runDailyScan();

    expect(notifications.scan).toHaveBeenCalled();
  });
});
