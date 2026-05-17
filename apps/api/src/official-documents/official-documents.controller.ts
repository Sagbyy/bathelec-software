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
import { CreateOfficialDocumentDto } from './dto/create-official-document.dto';
import { UpdateOfficialDocumentDto } from './dto/update-official-document.dto';
import { OfficialDocumentsService } from './official-documents.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('official-documents')
export class OfficialDocumentsController {
  constructor(
    private readonly officialDocumentsService: OfficialDocumentsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer ou mettre à jour ses documents officiels' })
  @ApiResponse({ status: 201, description: 'Documents enregistrés.' })
  @ApiBody({ type: CreateOfficialDocumentDto })
  createOrUpdate(
    @CurrentUser() user: AuthenticatedUser,
    @Body(ValidationPipe) createOfficialDocumentDto: CreateOfficialDocumentDto
  ) {
    return this.officialDocumentsService.createOrUpdate(
      user.userId,
      createOfficialDocumentDto
    );
  }

  @Get('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({ summary: 'Récupérer les documents officiels par userId' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Documents récupérés.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findByUserId(@Param('userId') userId: string) {
    return this.officialDocumentsService.findByUserId(+userId);
  }

  @Patch('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({ summary: 'Mettre à jour les documents officiels' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: UpdateOfficialDocumentDto })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  update(
    @Param('userId') userId: string,
    @Body() updateOfficialDocumentDto: UpdateOfficialDocumentDto
  ) {
    return this.officialDocumentsService.update(
      +userId,
      updateOfficialDocumentDto
    );
  }

  @Delete('by-user/:userId')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({ summary: 'Supprimer les documents officiels' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Documents supprimés.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  remove(@Param('userId') userId: string) {
    return this.officialDocumentsService.remove(+userId);
  }
}
