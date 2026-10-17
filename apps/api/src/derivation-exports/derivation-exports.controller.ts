import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { Role as UserRole } from '@repo/types';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Role } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';
import {
  DerivationExportsService,
  EnedisExportFile,
} from './derivation-exports.service';

export const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const toDownload = ({ fileName, buffer }: EnedisExportFile) =>
  new StreamableFile(buffer, {
    type: XLSX_MIME_TYPE,
    disposition: `attachment; filename="${fileName}"`,
  });

@ApiBearerAuth()
@ApiTags('derivation-exports')
@Role(UserRole.ADMIN, UserRole.SUPERVISOR)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('derivation-exports')
export class DerivationExportsController {
  constructor(private readonly exportsService: DerivationExportsService) {}

  @Get('derivations/:derivationId')
  @ApiOperation({ summary: 'Enedis Excel export of one completed derivation' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiProduces(XLSX_MIME_TYPE)
  async exportDerivation(
    @Param('derivationId', ParseIntPipe) derivationId: number
  ) {
    return toDownload(await this.exportsService.exportDerivation(derivationId));
  }

  @Get('chantiers/:chantierId')
  @ApiOperation({
    summary: 'Enedis Excel export of every completed derivation of a chantier',
  })
  @ApiParam({ name: 'chantierId', type: Number })
  @ApiProduces(XLSX_MIME_TYPE)
  async exportChantier(@Param('chantierId', ParseIntPipe) chantierId: number) {
    return toDownload(await this.exportsService.exportChantier(chantierId));
  }
}
