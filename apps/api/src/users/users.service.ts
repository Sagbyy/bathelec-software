import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UsersService.name);

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByUsername(username: string) {
    if (!username) throw new BadRequestException('username must be a string');

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return user;
  }

  async findOneById(id: number) {
    if (!id) throw new BadRequestException('No ID specified');

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async createUser(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    if (!email || !username || !password || !firstName || !lastName) {
      throw new HttpException(
        'You should to fill : email, username, password, firstName, lastName',
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'technician',
      },
    });
  }

  async findAllTechnicians() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
      },
      where: {
        role: 'technician',
      },
    });
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      this.logger.error(`Invalid password for user with ID ${userId}`);
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
      this.logger.log(
        `Password changed successfully for user with ID: ${userId}`
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error changing password for user with ID: ${userId}, error: ${error.message}`
      );
      throw new HttpException(
        'Error while changing password',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });

    return users;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    if (!userId) throw new BadRequestException('No ID specified');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateUserDto,
        omit: {
          password: true,
        },
      });

      this.logger.log(`User updated successfully: ${userId}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Error updating user with ID: ${userId}, error: ${error.message}`
      );
      throw new HttpException(
        'Error while updating user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
