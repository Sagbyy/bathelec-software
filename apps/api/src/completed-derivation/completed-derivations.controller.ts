import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Role as UserRole } from '@repo/types';
import { CompletedDerivationService } from './completed-derivations.service';
import { CreateCompletedDerivationDto } from './dto/create-completed-derivations.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.decorator';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CompletedDerivation } from './entities/completed-derivations.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('completed-derivations')
export class CompletedDerivationController {
  constructor(
    private readonly completedDerivationService: CompletedDerivationService
  ) {}

  @Post()
  @UseGuards(RoleGuard)
  @Role(UserRole.TECHNICIAN, UserRole.SITE_MANAGER)
  @ApiOperation({
    summary: 'Submit the report of a derivation assigned to the current user',
  })
  @ApiResponse({
    status: 201,
    description: 'The completed derivation has been successfully created.',
    type: CompletedDerivation,
  })
  @ApiResponse({
    status: 403,
    description: 'The derivation is assigned to another technician.',
  })
  @ApiResponse({
    status: 409,
    description: 'The derivation report is no longer editable.',
  })
  @ApiBody({
    type: CreateCompletedDerivationDto,
  })
  create(
    @Body(ValidationPipe)
    createCompletedDerivationDto: CreateCompletedDerivationDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.completedDerivationService.create(
      createCompletedDerivationDto,
      user
    );
  }

  @Get()
  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Find every derivation report' })
  findAll() {
    return this.completedDerivationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find the report of a derivation' })
  @ApiParam({ name: 'id', type: Number, description: 'The derivation id' })
  @ApiResponse({
    status: 403,
    description: 'The derivation belongs to another technician.',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.completedDerivationService.findOne(+id, user);
  }
}
