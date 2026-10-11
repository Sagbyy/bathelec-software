import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSiteTeamDto } from './dto/create-site-team.dto';
import { UpdateSiteTeamDto } from './dto/update-site-team.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteTeamsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(SiteTeamsService.name);

  async create(createSiteTeamDto: CreateSiteTeamDto) {
    if (!createSiteTeamDto.name) {
      throw new BadRequestException('Team name is required');
    }

    if (!createSiteTeamDto.description) {
      throw new BadRequestException('Team description is required');
    }

    const existingTeam = await this.prisma.siteTeam.findUnique({
      where: {
        name: createSiteTeamDto.name,
      },
    });

    if (existingTeam) {
      throw new BadRequestException('Team with this name already exists');
    }

    try {
      const team = await this.prisma.siteTeam.create({
        data: {
          name: createSiteTeamDto.name,
          description: createSiteTeamDto.description || null,
        },
      });

      this.logger.log(`Team created successfully: ${team.id}`);
      return team;
    } catch (error) {
      this.logger.error(`Error creating team: ${error.message}`, error.stack);
      throw new HttpException(
        'Error while creating team',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      const teams = await this.prisma.siteTeam.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return teams;
    } catch (error) {
      this.logger.error(`Error finding all teams: ${error.message}`);
      throw new HttpException(
        'Error while fetching teams',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllWithUsers() {
    try {
      const teams = await this.prisma.siteTeam.findMany({
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
        orderBy: {
          createdAt: 'desc',
        },
      });
      return teams;
    } catch (error) {
      this.logger.error(`Error finding teams with users: ${error.message}`);
      throw new HttpException(
        'Error while fetching teams with users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Team ID is required');
    }

    try {
      const team = await this.prisma.siteTeam.findUnique({
        where: { id },
      });

      if (!team) {
        throw new NotFoundException(`Team with ID ${id} not found`);
      }

      return team;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding team: ${error.message}`);
      throw new HttpException(
        'Error while fetching team',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOneWithUsers(id: number) {
    if (!id) {
      throw new BadRequestException('Team ID is required');
    }

    try {
      const team = await this.prisma.siteTeam.findUnique({
        where: { id },
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

      if (!team) {
        throw new NotFoundException(`Team with ID ${id} not found`);
      }

      return team;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding team with users: ${error.message}`);
      throw new HttpException(
        'Error while fetching team with users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, updateSiteTeamDto: UpdateSiteTeamDto) {
    if (!id) {
      throw new BadRequestException('Team ID is required');
    }

    const existingTeam = await this.prisma.siteTeam.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    if (
      updateSiteTeamDto.name &&
      updateSiteTeamDto.name !== existingTeam.name
    ) {
      const teamWithSameName = await this.prisma.siteTeam.findUnique({
        where: {
          name: updateSiteTeamDto.name,
        },
      });

      if (teamWithSameName) {
        throw new BadRequestException('Team with this name already exists');
      }
    }

    try {
      const updatedTeam = await this.prisma.siteTeam.update({
        where: { id },
        data: updateSiteTeamDto,
      });

      this.logger.log(`Team updated successfully: ${id}`);
      return updatedTeam;
    } catch (error) {
      this.logger.error(
        `Error updating team with ID: ${id}, error: ${error.message}`
      );
      throw new HttpException(
        'Error while updating team',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('Team ID is required');
    }

    const team = await this.prisma.siteTeam.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    try {
      await this.prisma.siteTeamMembership.deleteMany({
        where: { teamId: id },
      });

      await this.prisma.siteTeam.delete({
        where: { id },
      });

      this.logger.log(`Team deleted successfully: ${id}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Team deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error deleting team with ID: ${id}, error: ${error.message}`
      );
      throw new HttpException(
        'Error while deleting team',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addUserToTeam(userId: number, teamId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!teamId) {
      throw new BadRequestException('Team ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const team = await this.prisma.siteTeam.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const existingMembership = await this.prisma.siteTeamMembership.findUnique(
      {
        where: {
          userId_teamId: {
            userId,
            teamId,
          },
        },
      }
    );

    if (existingMembership) {
      throw new BadRequestException('User is already a member of this team');
    }

    try {
      const membership = await this.prisma.siteTeamMembership.create({
        data: { userId, teamId },
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

      this.logger.log(`User ${userId} added to team ${teamId} successfully`);
      return membership;
    } catch (error) {
      this.logger.error(
        `Error adding user to team: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        'Error while adding user to team',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async removeUserFromTeam(userId: number, teamId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!teamId) {
      throw new BadRequestException('Team ID is required');
    }

    const membership = await this.prisma.siteTeamMembership.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('User is not a member of this team');
    }

    try {
      await this.prisma.siteTeamMembership.delete({
        where: {
          userId_teamId: {
            userId,
            teamId,
          },
        },
      });

      this.logger.log(
        `User ${userId} removed from team ${teamId} successfully`
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'User removed from team successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error removing user from team: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        'Error while removing user from team',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUsersInTeam(teamId: number) {
    if (!teamId) {
      throw new BadRequestException('Team ID is required');
    }

    const team = await this.prisma.siteTeam.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    try {
      const memberships = await this.prisma.siteTeamMembership.findMany({
        where: { teamId },
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

      return memberships.map((membership) => membership.user);
    } catch (error) {
      this.logger.error(`Error fetching users in team: ${error.message}`);
      throw new HttpException(
        'Error while fetching users in team',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTeamsForUser(userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    try {
      const memberships = await this.prisma.siteTeamMembership.findMany({
        where: { userId },
        include: {
          team: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return memberships.map((membership) => membership.team);
    } catch (error) {
      this.logger.error(`Error fetching teams for user: ${error.message}`);
      throw new HttpException(
        'Error while fetching teams for user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
