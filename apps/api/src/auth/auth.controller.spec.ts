import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  const mockUsersService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('returns accessToken on valid credentials', async () => {
      mockAuthService.signIn.mockResolvedValueOnce({
        accessToken: 'jwt-token',
      });

      const result = await controller.login({
        username: 'adminuser',
        password: 'Pass123!',
      });

      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        'adminuser',
        'Pass123!'
      );
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('throws when signIn throws UnauthorizedException', async () => {
      mockAuthService.signIn.mockRejectedValueOnce(new Error('Unauthorized'));

      await expect(
        controller.login({ username: 'adminuser', password: 'wrong' })
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('returns logout message', () => {
      const result = controller.logout();
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });

  describe('register', () => {
    it('delegates to usersService.createUser', async () => {
      const user = { id: 1, username: 'newuser' };
      mockUsersService.createUser.mockResolvedValueOnce(user);

      const result = await controller.register({
        email: 'new@test.com',
        username: 'newuser',
        password: 'Pass123!',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        'new@test.com',
        'newuser',
        'Pass123!',
        'John',
        'Doe'
      );
      expect(result).toEqual(user);
    });
  });
});
