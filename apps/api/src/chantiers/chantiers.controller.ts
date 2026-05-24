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
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Role } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';
import { ChantiersService } from './chantiers.service';
import { CreateChantierDto } from './dto/request/create-chantier.dto';
import { UpdateChantierDto } from './dto/request/update-chantier.dto';

@ApiBearerAuth()
@ApiTags('chantiers')
@UseGuards(JwtAuthGuard)
@Controller('chantiers')
export class ChantiersController {
  constructor(private readonly chantiersService: ChantiersService) {}

  @Role('admin')
  @UseGuards(RoleGuard)
  @Post()
  @ApiOperation({ summary: 'Create a chantier' })
  create(@Body(new ValidationPipe()) dto: CreateChantierDto) {
    return this.chantiersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chantiers' })
  findAll() {
    return this.chantiersService.findAll();
  }

  @Get('ongoing')
  @ApiOperation({
    summary:
      'Get ongoing chantiers (at least one derivation not Completed, or no derivations)',
  })
  findOngoing() {
    return this.chantiersService.findOngoing();
  }

  @Get('finished')
  @ApiOperation({
    summary: 'Get finished chantiers (all derivations Completed)',
  })
  findFinished() {
    return this.chantiersService.findFinished();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chantier by id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.chantiersService.findOne(+id);
  }

  @Role('admin')
  @UseGuards(RoleGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a chantier' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body() dto: UpdateChantierDto) {
    return this.chantiersService.update(+id, dto);
  }

  @Role('admin')
  @UseGuards(RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chantier' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.chantiersService.remove(+id);
  }
}
