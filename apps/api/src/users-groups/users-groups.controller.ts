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
import { UsersGroupsService } from './users-groups.service';
import { CreateUsersGroupDto } from './dto/create-users-group.dto';
import { UpdateUsersGroupDto } from './dto/update-users-group.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { Role } from 'src/role/role.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users-groups')
export class UsersGroupsController {
  constructor(private readonly usersGroupsService: UsersGroupsService) {}

  @Post()
  @Role('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUsersGroupDto: CreateUsersGroupDto) {
    return this.usersGroupsService.create(createUsersGroupDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'List of all groups' })
  findAll() {
    return this.usersGroupsService.findAll();
  }

  @Get('with-users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all groups with their users' })
  @ApiResponse({
    status: 200,
    description: 'List of all groups with their users',
  })
  findAllWithUsers() {
    return this.usersGroupsService.findAllWithUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group found' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOne(@Param('id') id: string) {
    return this.usersGroupsService.findOne(+id);
  }

  @Get(':id/with-users')
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a group by ID with its users' })
  @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group with users found' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOneWithUsers(@Param('id') id: string) {
    return this.usersGroupsService.findOneWithUsers(+id);
  }

  @Get(':id/users')
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users in a group' })
  @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'List of users in the group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getUsersInGroup(@Param('id') id: string) {
    return this.usersGroupsService.getUsersInGroup(+id);
  }

  @Patch(':id')
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a group' })
  @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string,
    @Body() updateUsersGroupDto: UpdateUsersGroupDto
  ) {
    return this.usersGroupsService.update(+id, updateUsersGroupDto);
  }

  @Delete(':id')
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a group' })
  @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  remove(@Param('id') id: string) {
    return this.usersGroupsService.remove(+id);
  }

  @Post(':id/users/:userId')
  @Role('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a user to a group' })
  @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 201, description: 'User added to group successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or group not found' })
  addUserToGroup(
    @Param('id') groupId: string,
    @Param('userId') userId: string
  ) {
    return this.usersGroupsService.addUserToGroup(+userId, +groupId);
  }

  @Delete(':id/users/:userId')
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a user from a group' })
  @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User removed from group successfully',
  })
  @ApiResponse({ status: 404, description: 'User or group not found' })
  removeUserFromGroup(
    @Param('id') groupId: string,
    @Param('userId') userId: string
  ) {
    return this.usersGroupsService.removeUserFromGroup(+userId, +groupId);
  }

  @Get('user/:userId/groups')
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all groups for a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of groups for the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getGroupsForUser(@Param('userId') userId: string) {
    return this.usersGroupsService.getGroupsForUser(+userId);
  }
}
