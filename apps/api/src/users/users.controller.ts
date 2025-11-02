import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
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
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.decorator';
import { UserInformationsDto } from './dto/request/user-informations';
import { NotFoundDto } from './dto/response/not-found.response.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(RoleGuard)
  @Role('admin')
  async findAll() {
    this.logger.log('Finding all users');
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('informations')
  async user(@Request() req) {
    this.logger.log(`Finding user by ID: ${req.user.userId}`);
    this.logger.log(`User: ${JSON.stringify(req.user, null, 2)}`);
    return this.usersService.findOneById(req.user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Role('admin')
  @Get(':userId')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'The ID of the user' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: UserInformationsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundException,
  })
  async findOneById(@Param('userId') userId: string) {
    const user = await this.usersService.findOneById(parseInt(userId));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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
    type: NotFoundDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundDto,
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    return this.usersService.changePassword(changePasswordDto, req.user.userId);
  }
}
