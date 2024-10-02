import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
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
    console.log(loginUserDto);

    return this.authService.signIn(
      loginUserDto.username,
      loginUserDto.password
    );
  }
}
