import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role as UserRole } from '@repo/types';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Role } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { ExpiryNotificationsService } from './expiry-notifications.service';

@ApiBearerAuth()
@ApiTags('expiry-notifications')
@UseGuards(JwtAuthGuard)
@Controller('expiry-notifications')
export class ExpiryNotificationsController {
  constructor(private readonly notifications: ExpiryNotificationsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Expiry notifications visible to the current user (own documents, or all for admins and supervisors)',
  })
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.notifications.findForUser(user);
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Confirm having read an expiry notification' })
  acknowledge(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.notifications.acknowledge(id, user);
  }

  @Post('scan')
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Run the expiry scan immediately' })
  scan() {
    return this.notifications.scan();
  }
}
