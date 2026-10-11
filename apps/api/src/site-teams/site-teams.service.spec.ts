import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SiteTeamsService } from './site-teams.service';
import { PrismaService } from '../prisma/prisma.service';
import { SiteTeam, User, SiteTeamMembership } from '@prisma/client';
import { CreateSiteTeamDto } from './dto/create-site-team.dto';
import { UpdateSiteTeamDto } from './dto/update-site-team.dto';

describe('SiteTeamsService', () => {
  let service: SiteTeamsService;
  const mockPrismaService = {
    siteTeam: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    siteTeamMembership: {
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

  const mockTeam: SiteTeam = {
    id: 1,
    name: 'Test Team',
    description: 'Test Description',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockMembership: SiteTeamMembership = {
    id: 1,
    userId: 1,
    teamId: 1,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteTeamsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SiteTeamsService>(SiteTeamsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateSiteTeamDto = {
      name: 'New Team',
      description: 'New Description',
    };

    it('should create a team successfully', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);
      mockPrismaService.siteTeam.create.mockResolvedValue(mockTeam);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTeam);
      expect(mockPrismaService.siteTeam.findUnique).toHaveBeenCalledWith({
        where: { name: createDto.name },
      });
      expect(mockPrismaService.siteTeam.create).toHaveBeenCalledWith({
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
        'Team name is required'
      );
      expect(mockPrismaService.siteTeam.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when name is null', async () => {
      const invalidDto = { ...createDto, name: null as any };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.siteTeam.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when description is missing', async () => {
      const invalidDto = { ...createDto, description: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(invalidDto)).rejects.toThrow(
        'Team description is required'
      );
      expect(mockPrismaService.siteTeam.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when description is null', async () => {
      const invalidDto = { ...createDto, description: null as any };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.siteTeam.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when team with same name exists', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Team with this name already exists'
      );
      expect(mockPrismaService.siteTeam.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when create fails', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);
      mockPrismaService.siteTeam.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.create(createDto)).rejects.toThrow(HttpException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Error while creating team'
      );
    });
  });

  describe('findAll', () => {
    it('should return all teams', async () => {
      const teams = [mockTeam];
      mockPrismaService.siteTeam.findMany.mockResolvedValue(teams);

      const result = await service.findAll();

      expect(result).toEqual(teams);
      expect(mockPrismaService.siteTeam.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return empty array when no teams exist', async () => {
      mockPrismaService.siteTeam.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.siteTeam.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findAll()).rejects.toThrow(HttpException);
      await expect(service.findAll()).rejects.toThrow(
        'Error while fetching teams'
      );
    });
  });

  describe('findAllWithUsers', () => {
    it('should return all teams with users', async () => {
      const teamsWithUsers = [
        {
          ...mockTeam,
          teamMemberships: [
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
      mockPrismaService.siteTeam.findMany.mockResolvedValue(teamsWithUsers);

      const result = await service.findAllWithUsers();

      expect(result).toEqual(teamsWithUsers);
      expect(mockPrismaService.siteTeam.findMany).toHaveBeenCalled();
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.siteTeam.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findAllWithUsers()).rejects.toThrow(HttpException);
      await expect(service.findAllWithUsers()).rejects.toThrow(
        'Error while fetching teams with users'
      );
    });
  });

  describe('findOne', () => {
    it('should return a team when id is valid', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTeam);
      expect(mockPrismaService.siteTeam.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.findOne(null as any)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOne(null as any)).rejects.toThrow(
        'Team ID is required'
      );
      expect(mockPrismaService.siteTeam.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is undefined', async () => {
      await expect(service.findOne(undefined as any)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.siteTeam.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is 0', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.siteTeam.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when team is not found', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Team with ID 999 not found'
      );
    });

    it('should throw HttpException when findUnique fails', async () => {
      mockPrismaService.siteTeam.findUnique.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('findOneWithUsers', () => {
    const teamWithUsers = {
      ...mockTeam,
      teamMemberships: [
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

    it('should return a team with users when id is valid', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(teamWithUsers);

      const result = await service.findOneWithUsers(1);

      expect(result).toEqual(teamWithUsers);
      expect(mockPrismaService.siteTeam.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          teamMemberships: {
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

    it('should throw NotFoundException when team is not found', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.findOneWithUsers(999)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw HttpException when findUnique fails', async () => {
      mockPrismaService.siteTeam.findUnique.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.findOneWithUsers(1)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateSiteTeamDto = {
      name: 'Updated Team',
      description: 'Updated Description',
    };

    it('should update a team successfully', async () => {
      const updatedTeam = { ...mockTeam, ...updateDto };
      mockPrismaService.siteTeam.findUnique
        .mockResolvedValueOnce(mockTeam)
        .mockResolvedValueOnce(null);
      mockPrismaService.siteTeam.update.mockResolvedValue(updatedTeam);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedTeam);
      expect(mockPrismaService.siteTeam.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should update a team without changing name', async () => {
      const updateDtoSameName: UpdateSiteTeamDto = {
        description: 'Updated Description',
      };
      const updatedTeam = { ...mockTeam, ...updateDtoSameName };
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeam.update.mockResolvedValue(updatedTeam);

      const result = await service.update(1, updateDtoSameName);

      expect(result).toEqual(updatedTeam);
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.update(null as any, updateDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.siteTeam.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when team is not found', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException
      );
      expect(mockPrismaService.siteTeam.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when new name already exists', async () => {
      const existingTeamWithName = { ...mockTeam, id: 2 };
      mockPrismaService.siteTeam.findUnique
        .mockResolvedValueOnce(mockTeam)
        .mockResolvedValueOnce(existingTeamWithName)
        .mockResolvedValueOnce(mockTeam)
        .mockResolvedValueOnce(existingTeamWithName);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.update(1, updateDto)).rejects.toThrow(
        'Team with this name already exists'
      );
      expect(mockPrismaService.siteTeam.update).not.toHaveBeenCalled();
    });

    it('should throw HttpException when update fails', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeam.update.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.update(1, updateDto)).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a team successfully', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeamMembership.deleteMany.mockResolvedValue({});
      mockPrismaService.siteTeam.delete.mockResolvedValue(mockTeam);

      const result = await service.remove(1);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Team deleted successfully',
      });
      expect(
        mockPrismaService.siteTeamMembership.deleteMany
      ).toHaveBeenCalledWith({
        where: { teamId: 1 },
      });
      expect(mockPrismaService.siteTeam.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.remove(null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.siteTeam.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when team is not found', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.siteTeam.delete).not.toHaveBeenCalled();
    });

    it('should throw HttpException when delete fails', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeamMembership.deleteMany.mockResolvedValue({});
      mockPrismaService.siteTeam.delete.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
  });

  describe('addUserToTeam', () => {
    it('should add a user to a team successfully', async () => {
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
        team: {
          id: 1,
          name: 'Test Team',
          description: 'Test Description',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);
      mockPrismaService.siteTeamMembership.create.mockResolvedValue(
        membershipWithRelations
      );

      const result = await service.addUserToTeam(1, 1);

      expect(result).toEqual(membershipWithRelations);
      expect(mockPrismaService.siteTeamMembership.create).toHaveBeenCalledWith({
        data: { userId: 1, teamId: 1 },
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
          team: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.addUserToTeam(null as any, 1)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.addUserToTeam(null as any, 1)).rejects.toThrow(
        'User ID is required'
      );
      expect(
        mockPrismaService.siteTeamMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when teamId is null', async () => {
      await expect(service.addUserToTeam(1, null as any)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.addUserToTeam(1, null as any)).rejects.toThrow(
        'Team ID is required'
      );
      expect(
        mockPrismaService.siteTeamMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.addUserToTeam(999, 1)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.addUserToTeam(999, 1)).rejects.toThrow(
        'User with ID 999 not found'
      );
      expect(
        mockPrismaService.siteTeamMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when team is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.addUserToTeam(1, 999)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.addUserToTeam(1, 999)).rejects.toThrow(
        'Team with ID 999 not found'
      );
      expect(
        mockPrismaService.siteTeamMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user is already in team', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(
        mockMembership
      );

      await expect(service.addUserToTeam(1, 1)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.addUserToTeam(1, 1)).rejects.toThrow(
        'User is already a member of this team'
      );
      expect(
        mockPrismaService.siteTeamMembership.create
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when create fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);
      mockPrismaService.siteTeamMembership.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.addUserToTeam(1, 1)).rejects.toThrow(HttpException);
    });
  });

  describe('removeUserFromTeam', () => {
    it('should remove a user from a team successfully', async () => {
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(
        mockMembership
      );
      mockPrismaService.siteTeamMembership.delete.mockResolvedValue(
        mockMembership
      );

      const result = await service.removeUserFromTeam(1, 1);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User removed from team successfully',
      });
      expect(mockPrismaService.siteTeamMembership.delete).toHaveBeenCalledWith({
        where: {
          userId_teamId: {
            userId: 1,
            teamId: 1,
          },
        },
      });
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.removeUserFromTeam(null as any, 1)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.siteTeamMembership.delete
      ).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when teamId is null', async () => {
      await expect(service.removeUserFromTeam(1, null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.siteTeamMembership.delete
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when membership is not found', async () => {
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await expect(service.removeUserFromTeam(1, 1)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.removeUserFromTeam(1, 1)).rejects.toThrow(
        'User is not a member of this team'
      );
      expect(
        mockPrismaService.siteTeamMembership.delete
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when delete fails', async () => {
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(
        mockMembership
      );
      mockPrismaService.siteTeamMembership.delete.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.removeUserFromTeam(1, 1)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('getUsersInTeam', () => {
    it('should return all users in a team', async () => {
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

      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeamMembership.findMany.mockResolvedValue(
        memberships
      );

      const result = await service.getUsersInTeam(1);

      expect(result).toEqual([memberships[0].user]);
      expect(
        mockPrismaService.siteTeamMembership.findMany
      ).toHaveBeenCalledWith({
        where: { teamId: 1 },
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

    it('should throw BadRequestException when teamId is null', async () => {
      await expect(service.getUsersInTeam(null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.siteTeamMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when team is not found', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.getUsersInTeam(999)).rejects.toThrow(
        NotFoundException
      );
      expect(
        mockPrismaService.siteTeamMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(mockTeam);
      mockPrismaService.siteTeamMembership.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getUsersInTeam(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getTeamsForUser', () => {
    it('should return all teams for a user', async () => {
      const memberships = [
        {
          team: mockTeam,
        },
      ];

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.siteTeamMembership.findMany.mockResolvedValue(
        memberships
      );

      const result = await service.getTeamsForUser(1);

      expect(result).toEqual([mockTeam]);
      expect(
        mockPrismaService.siteTeamMembership.findMany
      ).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: {
          team: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.getTeamsForUser(null as any)).rejects.toThrow(
        BadRequestException
      );
      expect(
        mockPrismaService.siteTeamMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getTeamsForUser(999)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getTeamsForUser(999)).rejects.toThrow(
        'User with ID 999 not found'
      );
      expect(
        mockPrismaService.siteTeamMembership.findMany
      ).not.toHaveBeenCalled();
    });

    it('should throw HttpException when findMany fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.siteTeamMembership.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getTeamsForUser(1)).rejects.toThrow(HttpException);
    });
  });

  describe('findTeamsWithMembersForUser', () => {
    it("retourne les équipes de l'utilisateur avec leurs membres sans données sensibles", async () => {
      mockPrismaService.siteTeam.findMany.mockResolvedValue([mockTeam]);

      const result = await service.findTeamsWithMembersForUser(7);

      expect(result).toEqual([mockTeam]);
      expect(mockPrismaService.siteTeam.findMany).toHaveBeenCalledWith({
        where: { teamMemberships: { some: { userId: 7 } } },
        include: {
          teamMemberships: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    });
  });
});
