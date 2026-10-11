import { Test, TestingModule } from '@nestjs/testing';
import { SiteTeamsController } from './site-teams.controller';
import { SiteTeamsService } from './site-teams.service';
import { CreateSiteTeamDto } from './dto/create-site-team.dto';
import { UpdateSiteTeamDto } from './dto/update-site-team.dto';
import { SiteTeam, SiteTeamMembership } from '@prisma/client';
import { RoleGuard } from '../role/role.guard';
import { Role } from '@repo/types';

describe('SiteTeamsController', () => {
  let controller: SiteTeamsController;
  let service: SiteTeamsService;

  const mockSiteTeamsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithUsers: jest.fn(),
    findOne: jest.fn(),
    findOneWithUsers: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addUserToTeam: jest.fn(),
    removeUserFromTeam: jest.fn(),
    getUsersInTeam: jest.fn(),
    getTeamsForUser: jest.fn(),
    findTeamsWithMembersForUser: jest.fn(),
  };

  const mockTeam: SiteTeam = {
    id: 1,
    name: 'Test Team',
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

  const mockMembership: SiteTeamMembership & {
    user: typeof mockUser;
    team: SiteTeam;
  } = {
    id: 1,
    userId: 1,
    teamId: 1,
    createdAt: new Date('2024-01-01'),
    user: mockUser,
    team: mockTeam,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteTeamsController],
      providers: [
        {
          provide: SiteTeamsService,
          useValue: mockSiteTeamsService,
        },
      ],
    }).compile();

    controller = module.get<SiteTeamsController>(SiteTeamsController);
    service = module.get<SiteTeamsService>(SiteTeamsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('access control', () => {
    it('applies RoleGuard on the controller', () => {
      const guards = Reflect.getMetadata('__guards__', SiteTeamsController);
      expect(guards).toContain(RoleGuard);
    });

    it('restricts team management to admin and supervisor', () => {
      const roles = Reflect.getMetadata('role', SiteTeamsController);
      expect(roles).toEqual([Role.ADMIN, Role.SUPERVISOR]);
    });
  });

  describe('create', () => {
    const createDto: CreateSiteTeamDto = {
      name: 'New Team',
      description: 'New Description',
    };

    it('should create a team', async () => {
      mockSiteTeamsService.create.mockResolvedValue(mockTeam);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockTeam);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should call service.create with correct DTO', async () => {
      mockSiteTeamsService.create.mockResolvedValue(mockTeam);

      await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all teams', async () => {
      const teams = [mockTeam];
      mockSiteTeamsService.findAll.mockResolvedValue(teams);

      const result = await controller.findAll();

      expect(result).toEqual(teams);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no teams exist', async () => {
      mockSiteTeamsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllWithUsers', () => {
    it('should return all teams with users', async () => {
      const teamsWithUsers = [
        {
          ...mockTeam,
          teamMemberships: [
            {
              user: mockUser,
            },
          ],
        },
      ];
      mockSiteTeamsService.findAllWithUsers.mockResolvedValue(teamsWithUsers);

      const result = await controller.findAllWithUsers();

      expect(result).toEqual(teamsWithUsers);
      expect(service.findAllWithUsers).toHaveBeenCalled();
      expect(service.findAllWithUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a team by id', async () => {
      mockSiteTeamsService.findOne.mockResolvedValue(mockTeam);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockTeam);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      mockSiteTeamsService.findOne.mockResolvedValue(mockTeam);

      await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('findOneWithUsers', () => {
    it('should return a team with users by id', async () => {
      const teamWithUsers = {
        ...mockTeam,
        teamMemberships: [
          {
            user: mockUser,
          },
        ],
      };
      mockSiteTeamsService.findOneWithUsers.mockResolvedValue(teamWithUsers);

      const result = await controller.findOneWithUsers('1');

      expect(result).toEqual(teamWithUsers);
      expect(service.findOneWithUsers).toHaveBeenCalledWith(1);
      expect(service.findOneWithUsers).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      const teamWithUsers = {
        ...mockTeam,
        teamMemberships: [],
      };
      mockSiteTeamsService.findOneWithUsers.mockResolvedValue(teamWithUsers);

      await controller.findOneWithUsers('456');

      expect(service.findOneWithUsers).toHaveBeenCalledWith(456);
    });
  });

  describe('getUsersInTeam', () => {
    it('should return all users in a team', async () => {
      const users = [mockUser];
      mockSiteTeamsService.getUsersInTeam.mockResolvedValue(users);

      const result = await controller.getUsersInTeam('1');

      expect(result).toEqual(users);
      expect(service.getUsersInTeam).toHaveBeenCalledWith(1);
      expect(service.getUsersInTeam).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      mockSiteTeamsService.getUsersInTeam.mockResolvedValue([]);

      await controller.getUsersInTeam('789');

      expect(service.getUsersInTeam).toHaveBeenCalledWith(789);
    });
  });

  describe('update', () => {
    const updateDto: UpdateSiteTeamDto = {
      name: 'Updated Team',
      description: 'Updated Description',
    };

    it('should update a team', async () => {
      const updatedTeam = { ...mockTeam, ...updateDto };
      mockSiteTeamsService.update.mockResolvedValue(updatedTeam);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedTeam);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      const updatedTeam = { ...mockTeam, ...updateDto };
      mockSiteTeamsService.update.mockResolvedValue(updatedTeam);

      await controller.update('999', updateDto);

      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('should call service.update with partial DTO', async () => {
      const partialDto: UpdateSiteTeamDto = {
        description: 'Only description updated',
      };
      const updatedTeam = { ...mockTeam, ...partialDto };
      mockSiteTeamsService.update.mockResolvedValue(updatedTeam);

      await controller.update('1', partialDto);

      expect(service.update).toHaveBeenCalledWith(1, partialDto);
    });
  });

  describe('remove', () => {
    it('should delete a team', async () => {
      const deleteResult = {
        statusCode: 200,
        message: 'Team deleted successfully',
      };
      mockSiteTeamsService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('1');

      expect(result).toEqual(deleteResult);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      const deleteResult = {
        statusCode: 200,
        message: 'Team deleted successfully',
      };
      mockSiteTeamsService.remove.mockResolvedValue(deleteResult);

      await controller.remove('555');

      expect(service.remove).toHaveBeenCalledWith(555);
    });
  });

  describe('addUserToTeam', () => {
    it('should add a user to a team', async () => {
      mockSiteTeamsService.addUserToTeam.mockResolvedValue(mockMembership);

      const result = await controller.addUserToTeam('1', '2');

      expect(result).toEqual(mockMembership);
      expect(service.addUserToTeam).toHaveBeenCalledWith(2, 1);
      expect(service.addUserToTeam).toHaveBeenCalledTimes(1);
    });

    it('should convert string ids to numbers', async () => {
      mockSiteTeamsService.addUserToTeam.mockResolvedValue(mockMembership);

      await controller.addUserToTeam('10', '20');

      expect(service.addUserToTeam).toHaveBeenCalledWith(20, 10);
    });

    it('should call service with correct parameter order (userId, teamId)', async () => {
      mockSiteTeamsService.addUserToTeam.mockResolvedValue(mockMembership);

      await controller.addUserToTeam('5', '3');

      expect(service.addUserToTeam).toHaveBeenCalledWith(3, 5);
    });
  });

  describe('removeUserFromTeam', () => {
    it('should remove a user from a team', async () => {
      const removeResult = {
        statusCode: 200,
        message: 'User removed from team successfully',
      };
      mockSiteTeamsService.removeUserFromTeam.mockResolvedValue(removeResult);

      const result = await controller.removeUserFromTeam('1', '2');

      expect(result).toEqual(removeResult);
      expect(service.removeUserFromTeam).toHaveBeenCalledWith(2, 1);
      expect(service.removeUserFromTeam).toHaveBeenCalledTimes(1);
    });

    it('should convert string ids to numbers', async () => {
      const removeResult = {
        statusCode: 200,
        message: 'User removed from team successfully',
      };
      mockSiteTeamsService.removeUserFromTeam.mockResolvedValue(removeResult);

      await controller.removeUserFromTeam('15', '25');

      expect(service.removeUserFromTeam).toHaveBeenCalledWith(25, 15);
    });

    it('should call service with correct parameter order (userId, teamId)', async () => {
      const removeResult = {
        statusCode: 200,
        message: 'User removed from team successfully',
      };
      mockSiteTeamsService.removeUserFromTeam.mockResolvedValue(removeResult);

      await controller.removeUserFromTeam('7', '9');

      expect(service.removeUserFromTeam).toHaveBeenCalledWith(9, 7);
    });
  });

  describe('getTeamsForUser', () => {
    it('should return all teams for a user', async () => {
      const teams = [mockTeam];
      mockSiteTeamsService.getTeamsForUser.mockResolvedValue(teams);

      const result = await controller.getTeamsForUser('1');

      expect(result).toEqual(teams);
      expect(service.getTeamsForUser).toHaveBeenCalledWith(1);
      expect(service.getTeamsForUser).toHaveBeenCalledTimes(1);
    });

    it('should convert string userId to number', async () => {
      mockSiteTeamsService.getTeamsForUser.mockResolvedValue([]);

      await controller.getTeamsForUser('42');

      expect(service.getTeamsForUser).toHaveBeenCalledWith(42);
    });

    it('should return empty array when user has no teams', async () => {
      mockSiteTeamsService.getTeamsForUser.mockResolvedValue([]);

      const result = await controller.getTeamsForUser('1');

      expect(result).toEqual([]);
      expect(service.getTeamsForUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findMine', () => {
    it("retourne les équipes de l'utilisateur courant", async () => {
      mockSiteTeamsService.findTeamsWithMembersForUser.mockResolvedValue([
        mockTeam,
      ]);

      const result = await controller.findMine({
        userId: 7,
        username: 'lead',
        role: 'site_manager',
      });

      expect(result).toEqual([mockTeam]);
      expect(
        mockSiteTeamsService.findTeamsWithMembersForUser
      ).toHaveBeenCalledWith(7);
    });
  });
});
