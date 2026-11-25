import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role as UserRole } from '@repo/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.ADMIN, UserRole.SUPERVISOR)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(
      createUserDto.email,
      createUserDto.username,
      createUserDto.password,
      createUserDto.firstName,
      createUserDto.lastName
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { accessToken } = await this.authService.signIn(
      loginUserDto.username,
      loginUserDto.password
    );

    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout() {
    return { message: 'Logout successful' };
  }
}
