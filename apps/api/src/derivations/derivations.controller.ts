import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Role as UserRole } from '@repo/types';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Role } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { CreateDerivationDto } from './dto/request/create-derivation.dto';
import { DerivationsService } from './derivations.service';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { DerivationResponseDto } from './dto/response/derivation.response.dto';
import {
  GetDerivationByIdDto,
  GetDerivationByUserDto,
} from './dto/request/get-derivation.dto';
import { UpdateDerivationDto } from './dto/request/update-derivation.dto';
import { AssignDerivationTeamDto } from './dto/request/assign-derivation-team.dto';
import { AssignDerivationUserDto } from './dto/request/assign-derivation-user.dto';

export const STRICT_VALIDATION = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('derivations')
export class DerivationsController {
  constructor(private readonly derivationsService: DerivationsService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Role(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.SITE_MANAGER,
    UserRole.TECHNICIAN
  )
  @ApiOperation({ summary: 'Create a new derivation' })
  @ApiResponse({
    status: 201,
    description: 'The derivation has been successfully created.',
    type: DerivationResponseDto,
  })
  @ApiBody({ type: CreateDerivationDto })
  createDerivation(
    @Body(STRICT_VALIDATION) createDerivationDto: CreateDerivationDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.derivationsService.createDerivation(createDerivationDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Find all derivations' })
  @ApiOkResponse({
    description: 'The derivations have been successfully retrieved.',
    type: [DerivationResponseDto],
  })
  findAllDerivations() {
    return this.derivationsService.findAllDerivations();
  }

  @Get('me')
  @UseGuards(RoleGuard)
  @Role(UserRole.TECHNICIAN, UserRole.SITE_MANAGER)
  @ApiOperation({
    summary:
      'Find the derivations of the current user and the unassigned ones of their teams',
  })
  @ApiOkResponse({ type: [DerivationResponseDto] })
  findMyDerivations(@CurrentUser() user: AuthenticatedUser) {
    return this.derivationsService.findMyDerivations(user);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Find derivation by user id' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({
    description: 'The derivation has been successfully retrieved.',
    type: [DerivationResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'The derivation has not been found.',
  })
  @ApiBody({ type: GetDerivationByUserDto })
  findDerivationByUserId(@Param('userId') userId: number) {
    return this.derivationsService.findDerivationByUserId(userId);
  }

  @Get('by-id/:derivationId')
  @ApiOperation({ summary: 'Find derivation by id' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiOkResponse({
    description: 'The derivation has been successfully retrieved.',
    type: DerivationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The derivation has not been found.',
  })
  @ApiBody({ type: GetDerivationByIdDto })
  findDerivationById(@Param('derivationId') derivationId: number) {
    return this.derivationsService.findDerivationById(derivationId);
  }

  @Patch('/:derivationId')
  @ApiOperation({ summary: 'Update a derivation' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiOkResponse({
    description: 'The derivation has been successfully updated.',
    type: DerivationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The derivation has not been found.',
  })
  @ApiBody({ type: UpdateDerivationDto })
  updateDerivation(
    @Param('derivationId') derivationId: number,
    @Body(STRICT_VALIDATION) updateDerivationDto: UpdateDerivationDto
  ) {
    return this.derivationsService.updateDerivation(
      derivationId,
      updateDerivationDto
    );
  }

  @Patch('/:derivationId/team')
  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Assign a derivation to a site team' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiBody({ type: AssignDerivationTeamDto })
  @ApiOkResponse({ type: DerivationResponseDto })
  @ApiResponse({ status: 404, description: 'Derivation or team not found.' })
  assignTeam(
    @Param('derivationId') derivationId: number,
    @Body(STRICT_VALIDATION) assignDerivationTeamDto: AssignDerivationTeamDto
  ) {
    return this.derivationsService.assignTeam(
      derivationId,
      assignDerivationTeamDto.teamId
    );
  }

  @Patch('/:derivationId/assignee')
  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.SITE_MANAGER)
  @ApiOperation({ summary: 'Assign a derivation to a member of its team' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiBody({ type: AssignDerivationUserDto })
  @ApiOkResponse({ type: DerivationResponseDto })
  @ApiResponse({ status: 400, description: 'User is not a team member.' })
  @ApiResponse({ status: 403, description: 'Not a manager of this team.' })
  assignUser(
    @Param('derivationId') derivationId: number,
    @Body(STRICT_VALIDATION)
    assignDerivationUserDto: AssignDerivationUserDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.derivationsService.assignUser(
      derivationId,
      assignDerivationUserDto.userId,
      user
    );
  }

  @Post('/:derivationId/claim')
  @UseGuards(RoleGuard)
  @Role(UserRole.TECHNICIAN, UserRole.SITE_MANAGER)
  @ApiOperation({ summary: 'Assign an unassigned team derivation to oneself' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiOkResponse({ type: DerivationResponseDto })
  @ApiResponse({ status: 403, description: 'Not a member of this team.' })
  @ApiResponse({ status: 409, description: 'Derivation already assigned.' })
  claimDerivation(
    @Param('derivationId') derivationId: number,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.derivationsService.claimDerivation(derivationId, user);
  }
}
