import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SiteTeamsService } from './site-teams.service';
import { CreateSiteTeamDto } from './dto/create-site-team.dto';
import { UpdateSiteTeamDto } from './dto/update-site-team.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.decorator';
import { Role as UserRole } from '@repo/types';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Role(UserRole.ADMIN, UserRole.SUPERVISOR)
@Controller('site-teams')
export class SiteTeamsController {
  constructor(private readonly siteTeamsService: SiteTeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createSiteTeamDto: CreateSiteTeamDto) {
    return this.siteTeamsService.create(createSiteTeamDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'List of all teams' })
  findAll() {
    return this.siteTeamsService.findAll();
  }

  @Get('with-users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all teams with their users' })
  @ApiResponse({
    status: 200,
    description: 'List of all teams with their users',
  })
  findAllWithUsers() {
    return this.siteTeamsService.findAllWithUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team found' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  findOne(@Param('id') id: string) {
    return this.siteTeamsService.findOne(+id);
  }

  @Get(':id/with-users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a team by ID with its users' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team with users found' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  findOneWithUsers(@Param('id') id: string) {
    return this.siteTeamsService.findOneWithUsers(+id);
  }

  @Get(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users in a team' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'List of users in the team' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  getUsersInTeam(@Param('id') id: string) {
    return this.siteTeamsService.getUsersInTeam(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a team' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string,
    @Body() updateSiteTeamDto: UpdateSiteTeamDto
  ) {
    return this.siteTeamsService.update(+id, updateSiteTeamDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  remove(@Param('id') id: string) {
    return this.siteTeamsService.remove(+id);
  }

  @Post(':id/users/:userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a user to a team' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 201, description: 'User added to team successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or team not found' })
  addUserToTeam(
    @Param('id') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.siteTeamsService.addUserToTeam(+userId, +teamId);
  }

  @Delete(':id/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a user from a team' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User removed from team successfully',
  })
  @ApiResponse({ status: 404, description: 'User or team not found' })
  removeUserFromTeam(
    @Param('id') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.siteTeamsService.removeUserFromTeam(+userId, +teamId);
  }

  @Get('user/:userId/teams')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all teams for a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of teams for the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getTeamsForUser(@Param('userId') userId: string) {
    return this.siteTeamsService.getTeamsForUser(+userId);
  }
}
