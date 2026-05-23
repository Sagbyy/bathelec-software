import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { SelfOrAdminGuard } from '../common/guards/self-or-admin.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.decorator';
import { UpdateSpecialHabilitationDto } from './dto/update-special-habilitation.dto';
import { SpecialHabilitationsService } from './special-habilitations.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('special-habilitations')
export class SpecialHabilitationsController {
  constructor(private readonly service: SpecialHabilitationsService) {}

  @Get('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({
    summary: "Récupérer les habilitations spéciales d'un technicien",
  })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(+userId);
  }

  @Put('by-user/:userId')
  @Role('admin')
  @UseGuards(RoleGuard)
  @ApiOperation({
    summary: 'Mettre à jour les habilitations spéciales (admin uniquement)',
  })
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: UpdateSpecialHabilitationDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  upsert(
    @Param('userId') userId: string,
    @Body(ValidationPipe) dto: UpdateSpecialHabilitationDto
  ) {
    return this.service.upsert(+userId, dto);
  }
}
