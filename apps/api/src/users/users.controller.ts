import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('informations')
  async user(@Request() req) {
    return this.usersService.findOneById(req.user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('technicians')
  async allTechniciansInfo() {
    return this.usersService.findAllTechnicians();
  }
}
