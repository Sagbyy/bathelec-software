import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@repo/types';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('opens user management routes to admin and supervisor', () => {
    expect(Reflect.getMetadata('role', controller.findAll)).toEqual([
      Role.ADMIN,
      Role.SUPERVISOR,
    ]);
    expect(Reflect.getMetadata('role', controller.deleteUser)).toEqual([
      Role.ADMIN,
      Role.SUPERVISOR,
    ]);
  });
});

describe('UsersController requester-role forwarding', () => {
  let controller: UsersController;
  const mockUsersService = {
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
    mockUsersService.updateUser.mockResolvedValue({ id: 1 });
    mockUsersService.deleteUser.mockResolvedValue({ id: 1 });
  });

  it('forwards the requester role to updateUser', async () => {
    const dto = { firstName: 'Jane', role: Role.ADMIN };

    await controller.updateUser('1', dto, { user: { role: Role.SUPERVISOR } });

    expect(mockUsersService.updateUser).toHaveBeenCalledWith(
      1,
      dto,
      Role.SUPERVISOR
    );
  });

  it('forwards the requester role to deleteUser', async () => {
    await controller.deleteUser('1', { user: { role: Role.SUPERVISOR } });

    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(1, Role.SUPERVISOR);
  });
});
