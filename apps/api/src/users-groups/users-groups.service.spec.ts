import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersGroupsService } from './users-groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserGroup, User, UserGroupMembership } from '@prisma/client';
import { CreateUsersGroupDto } from './dto/create-users-group.dto';
import { UpdateUsersGroupDto } from './dto/update-users-group.dto';

describe('UsersGroupsService', () => {
  let service: UsersGroupsService;
  const mockPrismaService = {
    userGroup: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    userGroupMembership: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-01'),
  };

  const mockGroup: UserGroup = {
    id: 1,
    name: 'Test Group',
    description: 'Test Description',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockMembership: UserGroupMembership = {
    id: 1,
    userId: 1,
    groupId: 1,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersGroupsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersGroupsService>(UsersGroupsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateUsersGroupDto = {
      name: 'New Group',
      description: 'New Description',
    };

    it('should create a group successfully', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);
      mockPrismaService.userGroup.create.mockResolvedValue(mockGroup);

      const result = await service.create(createDto);

      expect(result).toEqual(mockGroup);
      expect(mockPrismaService.userGroup.findUnique).toHaveBeenCalledWith({
        where: { name: createDto.name },
      });
      expect(mockPrismaService.userGroup.create).toHaveBeenCalledWith({
        data: {
          name: createDto.name,
          description: createDto.description || null,
        },
      });
    });

    it('should throw BadRequestException when name is missing', async () => {
      const invalidDto = { ...createDto, name: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(invalidDto)).rejects.toThrow(
        'Group name is required'
      );
      expect(mockPrismaService.userGroup.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when name is null', async () => {
      const invalidDto = { ...createDto, name: null as any };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.userGroup.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when description is missing', async () => {
      const invalidDto = { ...createDto, description: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(invalidDto)).rejects.toThrow(
        'Group description is required'
      );
      expect(mockPrismaService.userGroup.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when description is null', async () => {
      const invalidDto = { ...createDto, description: null as any };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.userGroup.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when group with same name exists', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Group with this name already exists'
      );
      expect(mockPrismaService.userGroup.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when create fails', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);
      mockPrismaService.userGroup.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.create(createDto)).rejects.toThrow(HttpException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Error while creating group'
      );
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      const groups = [mockGroup];
      mockPrismaService.userGroup.findMany.mockResolvedValue(groups);

      const result = await service.findAll();

      expect(result).toEqual(groups);
      expect(mockPrismaService.userGroup.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return empty array when no groups exist', async () => {
      mockPrismaService.userGroup.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.userGroup.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findAll()).rejects.toThrow(HttpException);
      await expect(service.findAll()).rejects.toThrow(
        'Error while fetching groups'
      );
    });
  });

  describe('findAllWithUsers', () => {
    it('should return all groups with users', async () => {
      const groupsWithUsers = [
        {
          ...mockGroup,
          groupMemberships: [
            {
              user: {
                id: 1,
                email: 'test@test.com',
                username: 'testuser',
                firstName: 'Test',
                lastName: 'User',
                role: 'admin',
                createdAt: new Date('2024-01-01'),
              },
            },
          ],
        },
      ];
      mockPrismaService.userGroup.findMany.mockResolvedValue(groupsWithUsers);

      const result = await service.findAllWithUsers();

      expect(result).toEqual(groupsWithUsers);
      expect(mockPrismaService.userGroup.findMany).toHaveBeenCalled();
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.userGroup.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findAllWithUsers()).rejects.toThrow(HttpException);
      await expect(service.findAllWithUsers()).rejects.toThrow(
        'Error while fetching groups with users'
      );
    });
  });

  describe('findOne', () => {
    it('should return a group when id is valid', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);

      const result = await service.findOne(1);

      expect(result).toEqual(mockGroup);
      expect(mockPrismaService.userGroup.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.findOne(null as any)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOne(null as any)).rejects.toThrow(
        'Group ID is required'
      );
      expect(mockPrismaService.userGroup.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is undefined', async () => {
      await expect(service.findOne(undefined as any)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.userGroup.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is 0', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.userGroup.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when group is not found', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Group with ID 999 not found'
      );
    });

    it('should throw HttpException when findUnique fails', async () => {
      mockPrismaService.userGroup.findUnique.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('findOneWithUsers', () => {
    const groupWithUsers = {
      ...mockGroup,
      groupMemberships: [
        {
          user: {
            id: 1,
            email: 'test@test.com',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            role: 'admin',
            createdAt: new Date('2024-01-01'),
          },
        },
      ],
    };

    it('should return a group with users when id is valid', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(groupWithUsers);

      const result = await service.findOneWithUsers(1);

      expect(result).toEqual(groupWithUsers);
      expect(mockPrismaService.userGroup.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          groupMemberships: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.findOneWithUsers(null as any)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw NotFoundException when group is not found', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);

      await expect(service.findOneWithUsers(999)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw HttpException when findUnique fails', async () => {
      mockPrismaService.userGroup.findUnique.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findOneWithUsers(1)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateUsersGroupDto = {
      name: 'Updated Group',
      description: 'Updated Description',
    };

    it('should update a group successfully', async () => {
      const updatedGroup = { ...mockGroup, ...updateDto };
      mockPrismaService.userGroup.findUnique
        .mockResolvedValueOnce(mockGroup)
        .mockResolvedValueOnce(null);
      mockPrismaService.userGroup.update.mockResolvedValue(updatedGroup);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedGroup);
      expect(mockPrismaService.userGroup.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should update a group without changing name', async () => {
      const updateDtoSameName: UpdateUsersGroupDto = {
        description: 'Updated Description',
      };
      const updatedGroup = { ...mockGroup, ...updateDtoSameName };
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroup.update.mockResolvedValue(updatedGroup);

      const result = await service.update(1, updateDtoSameName);

      expect(result).toEqual(updatedGroup);
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.update(null as any, updateDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.userGroup.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when group is not found', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException
      );
      expect(mockPrismaService.userGroup.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when new name already exists', async () => {
      const existingGroupWithName = { ...mockGroup, id: 2 };
      mockPrismaService.userGroup.findUnique
        .mockResolvedValueOnce(mockGroup)
        .mockResolvedValueOnce(existingGroupWithName)
        .mockResolvedValueOnce(mockGroup)
        .mockResolvedValueOnce(existingGroupWithName);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.update(1, updateDto)).rejects.toThrow(
        'Group with this name already exists'
      );
      expect(mockPrismaService.userGroup.update).not.toHaveBeenCalled();
    });

    it('should throw HttpException when update fails', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroup.update.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.update(1, updateDto)).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a group successfully', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroupMembership.deleteMany.mockResolvedValue({});
      mockPrismaService.userGroup.delete.mockResolvedValue(mockGroup);

      const result = await service.remove(1);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Group deleted successfully',
      });
      expect(
        mockPrismaService.userGroupMembership.deleteMany
      ).toHaveBeenCalledWith({
        where: { groupId: 1 },
      });
      expect(mockPrismaService.userGroup.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.remove(null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.userGroup.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when group is not found', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.userGroup.delete).not.toHaveBeenCalled();
    });

    it('should throw HttpException when delete fails', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroupMembership.deleteMany.mockResolvedValue({});
      mockPrismaService.userGroup.delete.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
  });

  describe('addUserToGroup', () => {
    it('should add a user to a group successfully', async () => {
      const membershipWithRelations = {
        ...mockMembership,
        user: {
          id: 1,
          email: 'test@test.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          role: 'admin',
        },
        group: {
          id: 1,
          name: 'Test Group',
          description: 'Test Description',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroupMembership.findUnique.mockResolvedValue(null);
      mockPrismaService.userGroupMembership.create.mockResolvedValue(
        membershipWithRelations
      );

      const result = await service.addUserToGroup(1, 1);

      expect(result).toEqual(membershipWithRelations);
      expect(mockPrismaService.userGroupMembership.create).toHaveBeenCalledWith(
        {
          data: { userId: 1, groupId: 1 },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
            group: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        }
      );
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.addUserToGroup(null as any, 1)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.addUserToGroup(null as any, 1)).rejects.toThrow(
        'User ID is required'
      );
      expect(
        mockPrismaService.userGroupMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when groupId is null', async () => {
      await expect(service.addUserToGroup(1, null as any)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.addUserToGroup(1, null as any)).rejects.toThrow(
        'Group ID is required'
      );
      expect(
        mockPrismaService.userGroupMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.addUserToGroup(999, 1)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.addUserToGroup(999, 1)).rejects.toThrow(
        'User with ID 999 not found'
      );
      expect(
        mockPrismaService.userGroupMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when group is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);

      await expect(service.addUserToGroup(1, 999)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.addUserToGroup(1, 999)).rejects.toThrow(
        'Group with ID 999 not found'
      );
      expect(
        mockPrismaService.userGroupMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user is already in group', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroupMembership.findUnique.mockResolvedValue(
        mockMembership
      );

      await expect(service.addUserToGroup(1, 1)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.addUserToGroup(1, 1)).rejects.toThrow(
        'User is already a member of this group'
      );
      expect(
        mockPrismaService.userGroupMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when create fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroupMembership.findUnique.mockResolvedValue(null);
      mockPrismaService.userGroupMembership.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.addUserToGroup(1, 1)).rejects.toThrow(HttpException);
    });
  });

  describe('removeUserFromGroup', () => {
    it('should remove a user from a group successfully', async () => {
      mockPrismaService.userGroupMembership.findUnique.mockResolvedValue(
        mockMembership
      );
      mockPrismaService.userGroupMembership.delete.mockResolvedValue(
        mockMembership
      );

      const result = await service.removeUserFromGroup(1, 1);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User removed from group successfully',
      });
      expect(mockPrismaService.userGroupMembership.delete).toHaveBeenCalledWith(
        {
          where: {
            userId_groupId: {
              userId: 1,
              groupId: 1,
            },
          },
        }
      );
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.removeUserFromGroup(null as any, 1)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.userGroupMembership.delete
      ).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when groupId is null', async () => {
      await expect(service.removeUserFromGroup(1, null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.userGroupMembership.delete
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when membership is not found', async () => {
      mockPrismaService.userGroupMembership.findUnique.mockResolvedValue(null);

      await expect(service.removeUserFromGroup(1, 1)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.removeUserFromGroup(1, 1)).rejects.toThrow(
        'User is not a member of this group'
      );
      expect(
        mockPrismaService.userGroupMembership.delete
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when delete fails', async () => {
      mockPrismaService.userGroupMembership.findUnique.mockResolvedValue(
        mockMembership
      );
      mockPrismaService.userGroupMembership.delete.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.removeUserFromGroup(1, 1)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('getUsersInGroup', () => {
    it('should return all users in a group', async () => {
      const memberships = [
        {
          user: {
            id: 1,
            email: 'test@test.com',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            role: 'admin',
            createdAt: new Date('2024-01-01'),
          },
        },
      ];

      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroupMembership.findMany.mockResolvedValue(
        memberships
      );

      const result = await service.getUsersInGroup(1);

      expect(result).toEqual([memberships[0].user]);
      expect(
        mockPrismaService.userGroupMembership.findMany
      ).toHaveBeenCalledWith({
        where: { groupId: 1 },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              role: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should throw BadRequestException when groupId is null', async () => {
      await expect(service.getUsersInGroup(null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.userGroupMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when group is not found', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(null);

      await expect(service.getUsersInGroup(999)).rejects.toThrow(
        NotFoundException
      );
      expect(
        mockPrismaService.userGroupMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.userGroup.findUnique.mockResolvedValue(mockGroup);
      mockPrismaService.userGroupMembership.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getUsersInGroup(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getGroupsForUser', () => {
    it('should return all groups for a user', async () => {
      const memberships = [
        {
          group: mockGroup,
        },
      ];

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userGroupMembership.findMany.mockResolvedValue(
        memberships
      );

      const result = await service.getGroupsForUser(1);

      expect(result).toEqual([mockGroup]);
      expect(
        mockPrismaService.userGroupMembership.findMany
      ).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: {
          group: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.getGroupsForUser(null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.userGroupMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getGroupsForUser(999)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getGroupsForUser(999)).rejects.toThrow(
        'User with ID 999 not found'
      );
      expect(
        mockPrismaService.userGroupMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userGroupMembership.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getGroupsForUser(1)).rejects.toThrow(HttpException);
    });
  });
});
