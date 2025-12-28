import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when id is valid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.findOne(null)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(null)).rejects.toThrow(
        'id must be a number'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is undefined', async () => {
      await expect(service.findOne(undefined)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOne(undefined)).rejects.toThrow(
        'id must be a number'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is 0', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(0)).rejects.toThrow('id must be a number');
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return null when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user when username is valid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOneByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when username is null', async () => {
      await expect(service.findOneByUsername(null)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOneByUsername(null)).rejects.toThrow(
        'username must be a string'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when username is undefined', async () => {
      await expect(service.findOneByUsername(undefined)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOneByUsername(undefined)).rejects.toThrow(
        'username must be a string'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when username is empty string', async () => {
      await expect(service.findOneByUsername('')).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOneByUsername('')).rejects.toThrow(
        'username must be a string'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return null when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOneByUsername('nonexistent');

      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a user when id is valid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOneById(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when id is null', async () => {
      await expect(service.findOneById(null)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOneById(null)).rejects.toThrow(
        'No ID specified'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is undefined', async () => {
      await expect(service.findOneById(undefined)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.findOneById(undefined)).rejects.toThrow(
        'No ID specified'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when id is 0', async () => {
      await expect(service.findOneById(0)).rejects.toThrow(BadRequestException);
      await expect(service.findOneById(0)).rejects.toThrow('No ID specified');
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return null when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOneById(999);

      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('createUser', () => {
    const validEmail = 'newuser@test.com';
    const validUsername = 'newuser';
    const validPassword = 'password123';
    const validFirstName = 'New';
    const validLastName = 'User';

    it('should create a user with all valid parameters', async () => {
      const hashedPassword = 'hashedPassword789';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const newUser: User = {
        ...mockUser,
        id: 3,
        email: validEmail,
        username: validUsername,
        password: hashedPassword,
        firstName: validFirstName,
        lastName: validLastName,
        role: 'technician',
      };

      mockPrismaService.user.create.mockResolvedValue(newUser);

      const result = await service.createUser(
        validEmail,
        validUsername,
        validPassword,
        validFirstName,
        validLastName
      );

      expect(result).toEqual(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(validPassword, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: validEmail,
          username: validUsername,
          password: hashedPassword,
          firstName: validFirstName,
          lastName: validLastName,
          role: 'technician',
        },
      });
    });

    it('should throw HttpException when email is missing', async () => {
      await expect(
        service.createUser(
          '',
          validUsername,
          validPassword,
          validFirstName,
          validLastName
        )
      ).rejects.toThrow(HttpException);
      await expect(
        service.createUser(
          '',
          validUsername,
          validPassword,
          validFirstName,
          validLastName
        )
      ).rejects.toThrow(
        'You should to fill : email, username, password, firstName, lastName'
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when username is missing', async () => {
      await expect(
        service.createUser(
          validEmail,
          '',
          validPassword,
          validFirstName,
          validLastName
        )
      ).rejects.toThrow(HttpException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when password is missing', async () => {
      await expect(
        service.createUser(
          validEmail,
          validUsername,
          '',
          validFirstName,
          validLastName
        )
      ).rejects.toThrow(HttpException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when firstName is missing', async () => {
      await expect(
        service.createUser(
          validEmail,
          validUsername,
          validPassword,
          '',
          validLastName
        )
      ).rejects.toThrow(HttpException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when lastName is missing', async () => {
      await expect(
        service.createUser(
          validEmail,
          validUsername,
          validPassword,
          validFirstName,
          ''
        )
      ).rejects.toThrow(HttpException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when all parameters are missing', async () => {
      await expect(service.createUser('', '', '', '', '')).rejects.toThrow(
        HttpException
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when email is null', async () => {
      await expect(
        service.createUser(
          null,
          validUsername,
          validPassword,
          validFirstName,
          validLastName
        )
      ).rejects.toThrow(HttpException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when username is null', async () => {
      await expect(
        service.createUser(
          validEmail,
          null,
          validPassword,
          validFirstName,
          validLastName
        )
      ).rejects.toThrow(HttpException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllTechnicians', () => {
    it('should return all technicians', async () => {
      const technicians = [
        {
          id: 2,
          username: 'technician1',
          firstName: 'Tech',
          lastName: 'One',
        },
        {
          id: 3,
          username: 'technician2',
          firstName: 'Tech',
          lastName: 'Two',
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(technicians);

      const result = await service.findAllTechnicians();

      expect(result).toEqual(technicians);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
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
    });

    it('should return empty array when no technicians exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAllTechnicians();

      expect(result).toEqual([]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    const userId = 1;
    const currentPassword = 'currentPassword123';
    const newPassword = 'newPassword456';
    const changePasswordDto: ChangePasswordDto = {
      currentPassword,
      newPassword,
    };

    it('should change password successfully when all parameters are valid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: 'hashedNewPassword',
      });

      const result = await service.changePassword(changePasswordDto, userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        currentPassword,
        mockUser.password
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          password: 'hashedNewPassword',
        },
      });
    });

    it('should throw HttpException when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword(changePasswordDto, userId)
      ).rejects.toThrow(HttpException);
      await expect(
        service.changePassword(changePasswordDto, userId)
      ).rejects.toThrow('User not found');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('should throw HttpException when current password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword(changePasswordDto, userId)
      ).rejects.toThrow(HttpException);
      await expect(
        service.changePassword(changePasswordDto, userId)
      ).rejects.toThrow('Invalid password');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        currentPassword,
        mockUser.password
      );
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('should throw HttpException when update fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
      mockPrismaService.user.update.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.changePassword(changePasswordDto, userId)
      ).rejects.toThrow(HttpException);
      await expect(
        service.changePassword(changePasswordDto, userId)
      ).rejects.toThrow('Error while changing password');

      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const usersWithoutPassword = [
        {
          id: 1,
          email: 'test@test.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 2,
          email: 'tech@test.com',
          username: 'technician',
          firstName: 'Tech',
          lastName: 'Nician',
          role: 'technician',
          createdAt: new Date('2024-01-02'),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(usersWithoutPassword);

      const result = await service.findAll();

      expect(result).toEqual(usersWithoutPassword);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        omit: {
          password: true,
        },
      });
    });

    it('should return empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        omit: {
          password: true,
        },
      });
    });
  });

  describe('updateUser', () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      firstName: 'Updated',
      lastName: 'Name',
      email: 'updated@test.com',
    };

    it('should update user successfully when all parameters are valid', async () => {
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
        omit: {
          password: true,
        },
      });
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.updateUser(null, updateUserDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.updateUser(null, updateUserDto)).rejects.toThrow(
        'No ID specified'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when userId is undefined', async () => {
      await expect(
        service.updateUser(undefined, updateUserDto)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateUser(undefined, updateUserDto)
      ).rejects.toThrow('No ID specified');
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when userId is 0', async () => {
      await expect(service.updateUser(0, updateUserDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.updateUser(0, updateUserDto)).rejects.toThrow(
        'No ID specified'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw HttpException when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        HttpException
      );
      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        'User not found'
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('should throw HttpException when update fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        HttpException
      );
      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        'Error while updating user'
      );

      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should update user with partial data', async () => {
      const partialUpdateDto: UpdateUserDto = {
        firstName: 'Partial',
      };
      const updatedUser = {
        ...mockUser,
        firstName: 'Partial',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, partialUpdateDto);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: partialUpdateDto,
        omit: {
          password: true,
        },
      });
    });

    it('should update user with empty updateDto', async () => {
      const emptyUpdateDto: UpdateUserDto = {};
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.updateUser(userId, emptyUpdateDto);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: emptyUpdateDto,
        omit: {
          password: true,
        },
      });
    });
  });

  describe('deleteUser', () => {
    const userId = 1;

    it('should delete user successfully when user exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUser(userId);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw BadRequestException when userId is null', async () => {
      await expect(service.deleteUser(null)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.deleteUser(null)).rejects.toThrow('No ID specified');
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when userId is undefined', async () => {
      await expect(service.deleteUser(undefined)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.deleteUser(undefined)).rejects.toThrow(
        'No ID specified'
      );
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when userId is 0', async () => {
      await expect(service.deleteUser(0)).rejects.toThrow(BadRequestException);
      await expect(service.deleteUser(0)).rejects.toThrow('No ID specified');
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw HttpException when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(HttpException);
      await expect(service.deleteUser(userId)).rejects.toThrow(
        'User not found'
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });

    it('should throw HttpException when delete fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteUser(userId)).rejects.toThrow(HttpException);
      await expect(service.deleteUser(userId)).rejects.toThrow(
        'Error while deleting user'
      );

      expect(mockPrismaService.user.delete).toHaveBeenCalled();
    });
  });
});
