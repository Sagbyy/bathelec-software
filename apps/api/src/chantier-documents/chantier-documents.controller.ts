import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.decorator';
import { Role as UserRole } from '@repo/types';
import { ChantierDocumentsService } from './chantier-documents.service';
import { CreateChantierDocumentDto } from './dto/create-chantier-document.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chantier-documents')
export class ChantierDocumentsController {
  constructor(
    private readonly chantierDocumentsService: ChantierDocumentsService
  ) {}

  @Post('by-chantier/:chantierId')
  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Téléverser un document de chantier' })
  @ApiParam({ name: 'chantierId', type: Number })
  @ApiBody({ type: CreateChantierDocumentDto })
  @ApiResponse({ status: 201, description: 'Document enregistré.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  create(
    @Param('chantierId') chantierId: string,
    @Body(new ValidationPipe({ whitelist: true }))
    createChantierDocumentDto: CreateChantierDocumentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.chantierDocumentsService.create(
      +chantierId,
      user.userId,
      createChantierDocumentDto
    );
  }

  @Get('by-chantier/:chantierId')
  @ApiOperation({
    summary: 'Lister les documents d’un chantier (lecture seule)',
  })
  @ApiParam({ name: 'chantierId', type: Number })
  @ApiResponse({ status: 200, description: 'Documents récupérés.' })
  findByChantier(@Param('chantierId') chantierId: string) {
    return this.chantierDocumentsService.findByChantier(+chantierId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un document de chantier avec son fichier' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Document récupéré.' })
  @ApiResponse({ status: 404, description: 'Document introuvable.' })
  async findOne(@Param('id') id: string) {
    const document = await this.chantierDocumentsService.findOne(id);

    if (!document) {
      throw new NotFoundException('Chantier document not found');
    }

    return document;
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Supprimer un document de chantier' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Document supprimé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async remove(@Param('id') id: string) {
    const document = await this.chantierDocumentsService.remove(id);

    if (!document) {
      throw new NotFoundException('Chantier document not found');
    }

    return document;
  }
}
