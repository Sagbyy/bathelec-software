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
import { UpdateHabilitationDto } from './dto/update-habilitation.dto';
import { HabilitationsService } from './habilitations.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habilitations')
export class HabilitationsController {
  constructor(private readonly habilitationsService: HabilitationsService) {}

  @Get('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({ summary: "Récupérer les habilitations d'un technicien" })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Habilitations récupérées.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findByUserId(@Param('userId') userId: string) {
    return this.habilitationsService.findByUserId(+userId);
  }

  @Put('by-user/:userId')
  @Role('admin')
  @UseGuards(RoleGuard)
  @ApiOperation({
    summary:
      "Mettre à jour les habilitations d'un technicien (admin uniquement)",
  })
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: UpdateHabilitationDto })
  @ApiResponse({ status: 200, description: 'Habilitations mises à jour.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  upsert(
    @Param('userId') userId: string,
    @Body(ValidationPipe) dto: UpdateHabilitationDto
  ) {
    return this.habilitationsService.upsert(+userId, dto);
  }
}
