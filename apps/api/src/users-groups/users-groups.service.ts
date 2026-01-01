import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsersGroupDto } from './dto/create-users-group.dto';
import { UpdateUsersGroupDto } from './dto/update-users-group.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersGroupsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UsersGroupsService.name);

  async create(createUsersGroupDto: CreateUsersGroupDto) {
    if (!createUsersGroupDto.name) {
      throw new BadRequestException('Group name is required');
    }

    if (!createUsersGroupDto.description) {
      throw new BadRequestException('Group description is required');
    }

    const existingGroup = await this.prisma.userGroup.findUnique({
      where: {
        name: createUsersGroupDto.name,
      },
    });

    if (existingGroup) {
      throw new BadRequestException('Group with this name already exists');
    }

    try {
      const group = await this.prisma.userGroup.create({
        data: {
          name: createUsersGroupDto.name,
          description: createUsersGroupDto.description || null,
        },
      });

      this.logger.log(`Group created successfully: ${group.id}`);
      return group;
    } catch (error) {
      this.logger.error(`Error creating group: ${error.message}`, error.stack);
      throw new HttpException(
        'Error while creating group',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      const groups = await this.prisma.userGroup.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return groups;
    } catch (error) {
      this.logger.error(`Error finding all groups: ${error.message}`);
      throw new HttpException(
        'Error while fetching groups',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllWithUsers() {
    try {
      const groups = await this.prisma.userGroup.findMany({
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
        orderBy: {
          createdAt: 'desc',
        },
      });
      return groups;
    } catch (error) {
      this.logger.error(`Error finding groups with users: ${error.message}`);
      throw new HttpException(
        'Error while fetching groups with users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Group ID is required');
    }

    try {
      const group = await this.prisma.userGroup.findUnique({
        where: { id },
      });

      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }

      return group;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding group: ${error.message}`);
      throw new HttpException(
        'Error while fetching group',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOneWithUsers(id: number) {
    if (!id) {
      throw new BadRequestException('Group ID is required');
    }

    try {
      const group = await this.prisma.userGroup.findUnique({
        where: { id },
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

      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }

      return group;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding group with users: ${error.message}`);
      throw new HttpException(
        'Error while fetching group with users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, updateUsersGroupDto: UpdateUsersGroupDto) {
    if (!id) {
      throw new BadRequestException('Group ID is required');
    }

    const existingGroup = await this.prisma.userGroup.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (
      updateUsersGroupDto.name &&
      updateUsersGroupDto.name !== existingGroup.name
    ) {
      const groupWithSameName = await this.prisma.userGroup.findUnique({
        where: {
          name: updateUsersGroupDto.name,
        },
      });

      if (groupWithSameName) {
        throw new BadRequestException('Group with this name already exists');
      }
    }

    try {
      const updatedGroup = await this.prisma.userGroup.update({
        where: { id },
        data: updateUsersGroupDto,
      });

      this.logger.log(`Group updated successfully: ${id}`);
      return updatedGroup;
    } catch (error) {
      this.logger.error(
        `Error updating group with ID: ${id}, error: ${error.message}`
      );
      throw new HttpException(
        'Error while updating group',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('Group ID is required');
    }

    const group = await this.prisma.userGroup.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    try {
      await this.prisma.userGroupMembership.deleteMany({
        where: { groupId: id },
      });

      await this.prisma.userGroup.delete({
        where: { id },
      });

      this.logger.log(`Group deleted successfully: ${id}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Group deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error deleting group with ID: ${id}, error: ${error.message}`
      );
      throw new HttpException(
        'Error while deleting group',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addUserToGroup(userId: number, groupId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!groupId) {
      throw new BadRequestException('Group ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const group = await this.prisma.userGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const existingMembership = await this.prisma.userGroupMembership.findUnique(
      {
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      }
    );

    if (existingMembership) {
      throw new BadRequestException('User is already a member of this group');
    }

    try {
      const membership = await this.prisma.userGroupMembership.create({
        data: { userId, groupId },
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
      });

      this.logger.log(`User ${userId} added to group ${groupId} successfully`);
      return membership;
    } catch (error) {
      this.logger.error(
        `Error adding user to group: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        'Error while adding user to group',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async removeUserFromGroup(userId: number, groupId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!groupId) {
      throw new BadRequestException('Group ID is required');
    }

    const membership = await this.prisma.userGroupMembership.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('User is not a member of this group');
    }

    try {
      await this.prisma.userGroupMembership.delete({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      this.logger.log(
        `User ${userId} removed from group ${groupId} successfully`
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'User removed from group successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error removing user from group: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        'Error while removing user from group',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUsersInGroup(groupId: number) {
    if (!groupId) {
      throw new BadRequestException('Group ID is required');
    }

    const group = await this.prisma.userGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    try {
      const memberships = await this.prisma.userGroupMembership.findMany({
        where: { groupId },
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
      this.logger.error(`Error fetching users in group: ${error.message}`);
      throw new HttpException(
        'Error while fetching users in group',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getGroupsForUser(userId: number) {
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
      const memberships = await this.prisma.userGroupMembership.findMany({
        where: { userId },
        include: {
          group: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return memberships.map((membership) => membership.group);
    } catch (error) {
      this.logger.error(`Error fetching groups for user: ${error.message}`);
      throw new HttpException(
        'Error while fetching groups for user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
