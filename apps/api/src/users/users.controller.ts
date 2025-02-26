import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ChangePasswordResponseSuccessDto } from './dto/response/change-password-success.response.dto';
import { ChangePasswordInvalidDto } from './dto/response/change-password-not-found.response.dto';
import { ChangePasswordNotFoundDto } from './dto/response/change-password-invalid.response.dto';

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

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiOkResponse({
    description: 'The password has been successfully changed.',
    type: ChangePasswordResponseSuccessDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password',
    type: ChangePasswordInvalidDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ChangePasswordNotFoundDto,
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    return this.usersService.changePassword(changePasswordDto, req.user.userId);
  }
}
