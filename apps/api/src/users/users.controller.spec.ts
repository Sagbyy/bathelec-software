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

describe('UsersController updateUser role protection', () => {
  let controller: UsersController;
  const mockUsersService = { updateUser: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
    mockUsersService.updateUser.mockResolvedValue({ id: 1 });
  });

  it('keeps the role field when an admin performs the update', async () => {
    await controller.updateUser(
      '1',
      { firstName: 'Jane', role: Role.ADMIN },
      { user: { role: Role.ADMIN } }
    );

    expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, {
      firstName: 'Jane',
      role: Role.ADMIN,
    });
  });

  it('strips the role field when a supervisor performs the update', async () => {
    await controller.updateUser(
      '1',
      { firstName: 'Jane', role: Role.ADMIN },
      { user: { role: Role.SUPERVISOR } }
    );

    expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, {
      firstName: 'Jane',
    });
  });
});
