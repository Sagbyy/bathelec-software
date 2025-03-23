import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CompletedDerivationService } from './completed-derivations.service';
import { UpdateCompletedDerivationDto } from './dto/update-completed-derivations.dto';
import { CreateCompletedDerivationDto } from './dto/create-completed-derivations.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CompletedDerivation } from './entities/completed-derivations.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Role('technician')
@Controller('completed-derivations')
export class CompletedDerivationController {
  constructor(
    private readonly completedDerivationService: CompletedDerivationService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a completed derivation' })
  @ApiResponse({
    status: 201,
    description: 'The completed derivation has been successfully created.',
    type: CompletedDerivation,
  })
  @ApiBody({
    type: CreateCompletedDerivationDto,
  })
  create(
    @Body(ValidationPipe)
    createCompletedDerivationDto: CreateCompletedDerivationDto
  ) {
    return this.completedDerivationService.create(createCompletedDerivationDto);
  }

  @Get()
  findAll() {
    return this.completedDerivationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.completedDerivationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompletedDerivationDto: UpdateCompletedDerivationDto
  ) {
    return this.completedDerivationService.update(
      +id,
      updateCompletedDerivationDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.completedDerivationService.remove(+id);
  }
}
