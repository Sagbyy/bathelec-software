import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  @Post('change-password/:userId')
  @ApiOperation({ summary: 'Change password by user id' })
  @ApiParam({ name: 'userId', type: Number })
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
    @Param('userId', ParseIntPipe) userId: number
  ) {
    return this.usersService.changePassword(changePasswordDto, userId);
  }
}
