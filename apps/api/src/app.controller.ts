import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RoleGuard } from './role/role.guard';
import { Role } from './role/role.decorator';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard, RoleGuard)
@Role('technician')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
