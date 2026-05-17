import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { SelfOrAdminGuard } from '../common/guards/self-or-admin.guard';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { CreateVehicleDocumentDto } from './dto/create-vehicle-document.dto';
import { UpdateVehicleDocumentDto } from './dto/update-vehicle-document.dto';
import { VehicleDocumentsService } from './vehicle-documents.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicle-documents')
export class VehicleDocumentsController {
  constructor(
    private readonly vehicleDocumentsService: VehicleDocumentsService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer ou mettre à jour ses propres documents de véhicule',
  })
  @ApiResponse({ status: 201, description: 'Documents enregistrés.' })
  @ApiBody({ type: CreateVehicleDocumentDto })
  createOrUpdate(
    @CurrentUser() user: AuthenticatedUser,
    @Body(ValidationPipe) createVehicleDocumentDto: CreateVehicleDocumentDto
  ) {
    return this.vehicleDocumentsService.createOrUpdate(
      user.userId,
      createVehicleDocumentDto
    );
  }

  @Get('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({ summary: 'Récupérer les documents du véhicule par userId' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Documents récupérés.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findByUserId(@Param('userId') userId: string) {
    return this.vehicleDocumentsService.findByUserId(+userId);
  }

  @Patch('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({ summary: 'Mettre à jour les documents du véhicule' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: UpdateVehicleDocumentDto })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  update(
    @Param('userId') userId: string,
    @Body() updateVehicleDocumentDto: UpdateVehicleDocumentDto
  ) {
    return this.vehicleDocumentsService.update(
      +userId,
      updateVehicleDocumentDto
    );
  }

  @Delete('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({ summary: 'Supprimer les documents du véhicule' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Documents supprimés.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  remove(@Param('userId') userId: string) {
    return this.vehicleDocumentsService.remove(+userId);
  }
}
