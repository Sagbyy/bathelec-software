import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { CompletedDerivationService } from './completed-derivation.service';
import { UpdateCompletedDerivationDto } from './dto/update-completed-derivation.dto';
import { CompletedDerivation } from './entities/completed-derivation.entity';
import { CreateCompletedDerivationDto } from './dto/create-completed-derivation.dto';
@Controller('completed-derivation')
export class CompletedDerivationController {
  constructor(
    private readonly completedDerivationService: CompletedDerivationService
  ) {}

  @Post()
  create(@Body(ValidationPipe) createCompletedDerivationDto: CreateCompletedDerivationDto) {
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
