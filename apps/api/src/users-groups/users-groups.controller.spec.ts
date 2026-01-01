import { Test, TestingModule } from '@nestjs/testing';
import { UsersGroupsController } from './users-groups.controller';
import { UsersGroupsService } from './users-groups.service';
import { CreateUsersGroupDto } from './dto/create-users-group.dto';
import { UpdateUsersGroupDto } from './dto/update-users-group.dto';
import { UserGroup, UserGroupMembership } from '@prisma/client';

describe('UsersGroupsController', () => {
  let controller: UsersGroupsController;
  let service: UsersGroupsService;

  const mockUsersGroupsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithUsers: jest.fn(),
    findOne: jest.fn(),
    findOneWithUsers: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addUserToGroup: jest.fn(),
    removeUserFromGroup: jest.fn(),
    getUsersInGroup: jest.fn(),
    getGroupsForUser: jest.fn(),
  };

  const mockGroup: UserGroup = {
    id: 1,
    name: 'Test Group',
    description: 'Test Description',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  };

  const mockMembership: UserGroupMembership & {
    user: typeof mockUser;
    group: UserGroup;
  } = {
    id: 1,
    userId: 1,
    groupId: 1,
    createdAt: new Date('2024-01-01'),
    user: mockUser,
    group: mockGroup,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersGroupsController],
      providers: [
        {
          provide: UsersGroupsService,
          useValue: mockUsersGroupsService,
        },
      ],
    }).compile();

    controller = module.get<UsersGroupsController>(UsersGroupsController);
    service = module.get<UsersGroupsService>(UsersGroupsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateUsersGroupDto = {
      name: 'New Group',
      description: 'New Description',
    };

    it('should create a group', async () => {
      mockUsersGroupsService.create.mockResolvedValue(mockGroup);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockGroup);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should call service.create with correct DTO', async () => {
      mockUsersGroupsService.create.mockResolvedValue(mockGroup);

      await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      const groups = [mockGroup];
      mockUsersGroupsService.findAll.mockResolvedValue(groups);

      const result = await controller.findAll();

      expect(result).toEqual(groups);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no groups exist', async () => {
      mockUsersGroupsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllWithUsers', () => {
    it('should return all groups with users', async () => {
      const groupsWithUsers = [
        {
          ...mockGroup,
          groupMemberships: [
            {
              user: mockUser,
            },
          ],
        },
      ];
      mockUsersGroupsService.findAllWithUsers.mockResolvedValue(
        groupsWithUsers
      );

      const result = await controller.findAllWithUsers();

      expect(result).toEqual(groupsWithUsers);
      expect(service.findAllWithUsers).toHaveBeenCalled();
      expect(service.findAllWithUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a group by id', async () => {
      mockUsersGroupsService.findOne.mockResolvedValue(mockGroup);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockGroup);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      mockUsersGroupsService.findOne.mockResolvedValue(mockGroup);

      await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('findOneWithUsers', () => {
    it('should return a group with users by id', async () => {
      const groupWithUsers = {
        ...mockGroup,
        groupMemberships: [
          {
            user: mockUser,
          },
        ],
      };
      mockUsersGroupsService.findOneWithUsers.mockResolvedValue(groupWithUsers);

      const result = await controller.findOneWithUsers('1');

      expect(result).toEqual(groupWithUsers);
      expect(service.findOneWithUsers).toHaveBeenCalledWith(1);
      expect(service.findOneWithUsers).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      const groupWithUsers = {
        ...mockGroup,
        groupMemberships: [],
      };
      mockUsersGroupsService.findOneWithUsers.mockResolvedValue(groupWithUsers);

      await controller.findOneWithUsers('456');

      expect(service.findOneWithUsers).toHaveBeenCalledWith(456);
    });
  });

  describe('getUsersInGroup', () => {
    it('should return all users in a group', async () => {
      const users = [mockUser];
      mockUsersGroupsService.getUsersInGroup.mockResolvedValue(users);

      const result = await controller.getUsersInGroup('1');

      expect(result).toEqual(users);
      expect(service.getUsersInGroup).toHaveBeenCalledWith(1);
      expect(service.getUsersInGroup).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      mockUsersGroupsService.getUsersInGroup.mockResolvedValue([]);

      await controller.getUsersInGroup('789');

      expect(service.getUsersInGroup).toHaveBeenCalledWith(789);
    });
  });

  describe('update', () => {
    const updateDto: UpdateUsersGroupDto = {
      name: 'Updated Group',
      description: 'Updated Description',
    };

    it('should update a group', async () => {
      const updatedGroup = { ...mockGroup, ...updateDto };
      mockUsersGroupsService.update.mockResolvedValue(updatedGroup);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedGroup);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      const updatedGroup = { ...mockGroup, ...updateDto };
      mockUsersGroupsService.update.mockResolvedValue(updatedGroup);

      await controller.update('999', updateDto);

      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('should call service.update with partial DTO', async () => {
      const partialDto: UpdateUsersGroupDto = {
        description: 'Only description updated',
      };
      const updatedGroup = { ...mockGroup, ...partialDto };
      mockUsersGroupsService.update.mockResolvedValue(updatedGroup);

      await controller.update('1', partialDto);

      expect(service.update).toHaveBeenCalledWith(1, partialDto);
    });
  });

  describe('remove', () => {
    it('should delete a group', async () => {
      const deleteResult = {
        statusCode: 200,
        message: 'Group deleted successfully',
      };
      mockUsersGroupsService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('1');

      expect(result).toEqual(deleteResult);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      const deleteResult = {
        statusCode: 200,
        message: 'Group deleted successfully',
      };
      mockUsersGroupsService.remove.mockResolvedValue(deleteResult);

      await controller.remove('555');

      expect(service.remove).toHaveBeenCalledWith(555);
    });
  });

  describe('addUserToGroup', () => {
    it('should add a user to a group', async () => {
      mockUsersGroupsService.addUserToGroup.mockResolvedValue(mockMembership);

      const result = await controller.addUserToGroup('1', '2');

      expect(result).toEqual(mockMembership);
      expect(service.addUserToGroup).toHaveBeenCalledWith(2, 1);
      expect(service.addUserToGroup).toHaveBeenCalledTimes(1);
    });

    it('should convert string ids to numbers', async () => {
      mockUsersGroupsService.addUserToGroup.mockResolvedValue(mockMembership);

      await controller.addUserToGroup('10', '20');

      expect(service.addUserToGroup).toHaveBeenCalledWith(20, 10);
    });

    it('should call service with correct parameter order (userId, groupId)', async () => {
      mockUsersGroupsService.addUserToGroup.mockResolvedValue(mockMembership);

      await controller.addUserToGroup('5', '3');

      expect(service.addUserToGroup).toHaveBeenCalledWith(3, 5);
    });
  });

  describe('removeUserFromGroup', () => {
    it('should remove a user from a group', async () => {
      const removeResult = {
        statusCode: 200,
        message: 'User removed from group successfully',
      };
      mockUsersGroupsService.removeUserFromGroup.mockResolvedValue(
        removeResult
      );

      const result = await controller.removeUserFromGroup('1', '2');

      expect(result).toEqual(removeResult);
      expect(service.removeUserFromGroup).toHaveBeenCalledWith(2, 1);
      expect(service.removeUserFromGroup).toHaveBeenCalledTimes(1);
    });

    it('should convert string ids to numbers', async () => {
      const removeResult = {
        statusCode: 200,
        message: 'User removed from group successfully',
      };
      mockUsersGroupsService.removeUserFromGroup.mockResolvedValue(
        removeResult
      );

      await controller.removeUserFromGroup('15', '25');

      expect(service.removeUserFromGroup).toHaveBeenCalledWith(25, 15);
    });

    it('should call service with correct parameter order (userId, groupId)', async () => {
      const removeResult = {
        statusCode: 200,
        message: 'User removed from group successfully',
      };
      mockUsersGroupsService.removeUserFromGroup.mockResolvedValue(
        removeResult
      );

      await controller.removeUserFromGroup('7', '9');

      expect(service.removeUserFromGroup).toHaveBeenCalledWith(9, 7);
    });
  });

  describe('getGroupsForUser', () => {
    it('should return all groups for a user', async () => {
      const groups = [mockGroup];
      mockUsersGroupsService.getGroupsForUser.mockResolvedValue(groups);

      const result = await controller.getGroupsForUser('1');

      expect(result).toEqual(groups);
      expect(service.getGroupsForUser).toHaveBeenCalledWith(1);
      expect(service.getGroupsForUser).toHaveBeenCalledTimes(1);
    });

    it('should convert string userId to number', async () => {
      mockUsersGroupsService.getGroupsForUser.mockResolvedValue([]);

      await controller.getGroupsForUser('42');

      expect(service.getGroupsForUser).toHaveBeenCalledWith(42);
    });

    it('should return empty array when user has no groups', async () => {
      mockUsersGroupsService.getGroupsForUser.mockResolvedValue([]);

      const result = await controller.getGroupsForUser('1');

      expect(result).toEqual([]);
      expect(service.getGroupsForUser).toHaveBeenCalledWith(1);
    });
  });
});
