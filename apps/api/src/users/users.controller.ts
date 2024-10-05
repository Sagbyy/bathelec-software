import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsernameDto } from './dto/username.dto';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.FOUND)
  @Get('informations')
  async user(@Body() usernameDto: UsernameDto) {
    return this.usersService.findOneByUsername(usernameDto.username);
  }
}
